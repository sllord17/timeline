import { Offset, SVGElementX } from './types'
import { svg, toTextFragment } from './util'

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

      const label = svg('tspan', {
        append_to: column,
        class: 'column-text'
      })

      const text = toTextFragment(t.get(this.config.field))
      label.appendChild(text)
      offset.y += t.get('height') + this.options.padding
    })
  }

  getWidth(): number {
    return this.container.getBBox().width
  }
}
