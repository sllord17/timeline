import { Consumer, EVENT } from '../events'

import Column from './Column'
import { Offset } from '../types'
import Task from '../task/Task'
import { ViewOptions } from '../options'
import prop from '../prop'

export default class Columns extends prop implements Consumer {
  private options: ViewOptions
  constructor(options: ViewOptions, tasks: Task[]) {
    super({
      tasks: tasks,
      columns: options.columns.map((c) => new Column(options, c, tasks))
    })
    this.options = options
    this.options.subscribe(EVENT.AFTER_RENDER, this)

    this.set('parent', options.parent.querySelector('.timeline-left'))
    this.set('body', options.parent.querySelector('.timeline-left-bottom > svg'))
    this.set('header', options.parent.querySelector('.timeline-left-top > svg'))
  }

  eventHandler(event: EVENT): void {
    if (event == EVENT.AFTER_RENDER) {
      const offset: Offset = { x: 0, y: 0 }
      this.get('columns').forEach((c: Column) => {
        c.get('title').setAttribute('x', offset.x + this.options.padding / 2)
        c.get('dom').setAttribute(
          'transform',
          `translate(${offset.x + this.options.padding / 2}, 0)`
        )
        offset.x += c.getWidth() + this.options.padding
      })

      this.get('body').setAttribute('width', offset.x)
      this.get('header').setAttribute('width', offset.x)
      this.get('parent').setAttribute('width', offset.x)

      this.options.dispatch(EVENT.AFTER_LAYOUT)
    }
  }

  public render() {
    const dom = this.get('body')
    dom.setAttribute('height', this.get('height'))
    const header = this.get('header')

    const offset: Offset = { x: this.options.padding, y: 0 }
    this.get('columns').forEach((col: Column) => {
      col.render(header, dom, offset)
    })
  }
}
