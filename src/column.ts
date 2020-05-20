import { svg, toTextFragment } from './util'

import { ColumnOptions } from './grid'
import { SVGElementX } from './types'
import Tasks from './tasks'
import { TimelineOptions } from './timeline'

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

  render(layer: SVGElementX, x: number) {
    this.container = svg('g', {
      append_to: layer,
      class: 'column-wrapper',
      x: x
    })

    let y = this.options.headerHeight + this.options.padding + 6

    this.tasks.forEach((t) => {
      const label = svg('text', {
        append_to: this.container,
        class: 'column-wrapper',
        y: y,
        x: x
      })

      const text = toTextFragment(t.name)
      label.appendChild(text)
      y += t.height + this.options.padding
    })
  }

  getWidth(): number {
    return this.container.getBBox().width
  }
}
