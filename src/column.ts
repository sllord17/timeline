import { Offset, SVGElementX } from './types'
import { svg, toTextFragment } from './util'

import Task from './task'
import Tasks from './tasks'
import { TimelineOptions } from './timeline'

export interface ColumnOptions {
  id: string
  text: string
  field: string
  customClass?: string
}

export default class Column {
  private options: TimelineOptions
  private config: ColumnOptions
  private tasks: Tasks
  private container: SVGElementX

  constructor(options: TimelineOptions, config: ColumnOptions, tasks: Tasks) {
    this.options = options
    this.config = config
    this.tasks = tasks
  }

  render(layer: SVGElementX, offset: Offset) {
    offset.y = this.options.headerHeight

    this.container = svg('g', {
      append_to: layer,
      class: 'column-wrapper',
      transform: `translate(${offset.x}, ${offset.y})`
    })

    const title = svg('text', {
      append_to: this.container,
      class: 'column-header'
    })

    const text = toTextFragment(this.config.text)
    title.appendChild(text)

    offset.y = this.options.padding + 6

    this.tasks.forEach((t) => {
      const column = svg('text', {
        append_to: this.container,
        class: 'column-' + this.config.field,
        height: t.get('height'),
        transform: `translate(0, ${offset.y})`
      })

      this.renderRow(column, t)
      offset.y += t.get('height') + this.options.padding
    })
  }

  getWidth(): number {
    return this.container.getBBox().width
  }

  private renderRow(layer: SVGElementX, task: Task) {
    const value = task.get(this.config.field)
    if (!value) return

    if (typeof value == 'string' || typeof value == 'number') {
      return this.renderTspan(layer, task, { label: value })
    }

    console.assert(Array.isArray(value), "Column value isn't a string or array")

    const offset: Offset = { x: 0, y: 0 }

    ;(<{ [key: string]: any }[]>value).forEach((v, idx) => {
      this.renderTspan(layer, task, v, offset)
      offset.y += task.getRowHeight(idx)
    })
  }

  private renderTspan(layer: SVGElementX, task: Task, obj: any, offset: Offset = { x: 0, y: 0 }) {
    const label = svg('tspan', {
      append_to: layer,
      class: 'column-text',
      dy: offset.y,
      x: 0
    })

    if (obj.labelStyle) {
      label.applyStyle(obj.labelStyle)
    }

    const text = toTextFragment(obj.label)
    label.appendChild(text)
  }
}
