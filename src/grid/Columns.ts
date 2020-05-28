import { Consumer, EVENT } from '../events'
import { Offset, SVGElementX } from '../types'
import { svg, toDom } from '../util'

import Column from './Column'
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
  }

  eventHandler(event: EVENT): void {
    if (event == EVENT.AFTER_RENDER) {
      const offset: Offset = { x: 0, y: 0 }
      this.get('columns').forEach((c: Column, idx: number) => {
        c.get('title').setAttribute('x', offset.x + this.options.padding / 2)
        c.get('dom').setAttribute(
          'transform',
          `translate(${offset.x + this.options.padding / 2}, 0)`
        )
        offset.x += c.getWidth() + this.options.padding
      })
      ;(<string[]>['header', 'body']).forEach((k) => {
        const node = this.get(k)
        node.setAttribute('width', offset.x)
      })
      this.get('parent').setAttribute('width', offset.x)
      console.log(offset.x)
    }
  }

  public render(div: HTMLDivElement) {
    this.set('parent', div)
    const headerHeight = this.options.headerHeight + 10
    const headerParent = toDom(`<div style="overflow: hidden;" height="${headerHeight}"></div>`)

    this.set(
      'header',
      svg('svg', {
        append_to: headerParent,
        height: headerHeight,
        x: 0,
        y: 0
      })
    )

    const bodyParent = toDom(`<div style="overflow: hidden; flex: 1;"></div>`)
    this.set('bodyParent', bodyParent)
    this.set(
      'body',
      svg('svg', {
        append_to: bodyParent,
        height: this.get('height'),
        y: headerHeight,
        x: 0
      })
    )

    div.append(headerParent, bodyParent)

    const dom = this.get('body')
    const header = this.get('header')

    const offset: Offset = { x: this.options.padding, y: 0 }
    this.get('columns').forEach((col: Column) => {
      col.render(header, dom, offset)
    })
  }
}
