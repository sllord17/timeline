import { Offset, SVGElementX } from '../types'
import { svg, toTextFragment } from '../util'

import Task from '../task/Task'
import Prop from '../prop'
import { Consumer, EVENT } from '../events'
import { ViewOptions, ColumnOptions } from '../options'

export default class Column extends Prop implements Consumer {
  private options: ViewOptions

  constructor(options: ViewOptions, config: ColumnOptions, tasks: Task[]) {
    super({
      ...config,
      tasks: tasks
    })
    this.options = options
    options.subscribe(EVENT.AFTER_RENDER, this)
  }

  eventHandler(event: EVENT): void {
    if (event == EVENT.AFTER_RENDER) {
      this.get('dom')
        .querySelectorAll('.column-background')
        .forEach((r: SVGElementX) => {
          r.setAttribute('width', r.columnRow.getBBox().width + '')
        })
    }
  }

  render(header: SVGElementX, body: SVGElementX, offset: Offset) {
    offset.y = this.options.headerHeight

    const title = svg('text', {
      append_to: header,
      class: 'column-header',
      x: offset.x,
      y: offset.y
    })
    this.set('title', title)

    const text = toTextFragment(this.get('text'))
    title.appendChild(text)

    this.set(
      'dom',
      svg('g', {
        append_to: body,
        class: 'column-wrapper',
        transform: `translate(${offset.x}, 0)`
      })
    )

    offset.y = this.options.padding / 2

    this.get('tasks').forEach((t: Task) => {
      const column = svg('text', {
        append_to: this.get('dom'),
        class: 'column-' + this.get('field'),
        height: t.get('height'),
        transform: `translate(0, ${offset.y})`
      })

      const bg = svg('g', {
        prepend_to: this.get('dom'),
        class: 'column-background-' + this.get('field'),
        height: t.get('height'),
        transform: `translate(0, ${offset.y})`
      })

      this.renderRow(column, bg, t)
      offset.y += t.get('height') + this.options.padding
    })
  }

  getWidth(): number {
    return this.get('dom').getBBox().width
  }

  private renderRow(layer: SVGElementX, backgroundLayer: SVGElementX, task: Task) {
    const value = task.get(this.get('field'))
    if (!value) return

    if (typeof value == 'string' || typeof value == 'number') {
      return this.renderTspan(layer, null, task, { label: value })
    }

    console.assert(Array.isArray(value), "Column value isn't a string or array")

    const offset: Offset = { x: 0, y: 0 }

    ;(<{ [key: string]: any }[]>value).forEach((v, idx) => {
      this.renderTspan(layer, backgroundLayer, task, v, offset, idx)
      offset.y += task.getRowHeight(idx)
    })
  }

  private renderTspan(
    textLayer: SVGElementX,
    backgroundLayer: SVGElementX,
    task: Task,
    obj: any,
    offset: Offset = { x: 0, y: 0 },
    idx: number = 0
  ) {
    const label = svg('tspan', {
      append_to: textLayer,
      class: 'column-text',
      dy: offset.y,
      'dominant-baseline': 'hanging',
      x: 0
    })

    if (obj.labelStyle) {
      label.applyStyle(obj.labelStyle)
    }

    const text = toTextFragment(obj.label)
    label.appendChild(text)

    if (obj.backgroundStyle) {
      const rect = svg('rect', {
        x: 0,
        dy: offset.y,
        height: task.getRowHeight(idx),
        prepend_to: backgroundLayer,
        class: 'column-background',
        id: obj.label
      })
      rect.columnRow = label
      rect.applyStyle(obj.backgroundStyle)
    }
  }
}
