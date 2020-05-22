/** @module timeline/grid */

import { Offset, SVGElementX } from '../types'
import Task, { TaskOptions } from '../task/Task'
import { VIEW_MODE, ViewOptions } from '../view'

import Background from './Background'
import Column from './Column'
import Header from './Header'
import Prop from '../prop'
import dayjs from 'dayjs'
import { svg } from '../util'
import { Consumer, EVENT } from '../events'

export default class Grid extends Prop implements Consumer {
  private options: ViewOptions

  constructor(options: ViewOptions, taskOptions: TaskOptions[]) {
    super({
      background: new Background(options),
      header: new Header(options),
      tasks: taskOptions.map((o) => new Task(options, o))
    })

    this.options = options
    this.options.subscribe(EVENT.AFTER_RENDER, this)

    this.set(
      'columns',
      options.columns.map((c) => new Column(this.options, c, this.get('tasks')))
    )

    this.setupDates()
  }

  eventHandler(event: EVENT): void {
    if (event == EVENT.AFTER_RENDER) {
      const offset: Offset = { x: 0, y: 0 }
      this.get('columns').forEach((c: Column, idx: number) => {
        c.get('dom').setAttribute(
          'transform',
          `translate(${offset.x + this.options.padding / 2}, ${this.options.headerHeight + 6})`
        )
        offset.x += c.getWidth() + this.options.padding
      })

      this.get('header').get('dom').setAttribute('transform', `translate(${offset.x}, 0)`)
      this.get('background')
        .get('dom')
        .setAttribute('transform', `translate(${offset.x}, ${this.options.headerHeight + 2})`)

      this.get('background')
        .get('dom')
        .querySelectorAll('.grid-row')
        .forEach((d: SVGElementX) => {
          d.setAttribute('x', -offset.x + '')
          d.setAttribute('width', d.getWidth() + offset.x + '')
        })

      this.get('background')
        .get('dom')
        .querySelectorAll('.row-line')
        .forEach((d: SVGElementX) => {
          d.setAttribute('x1', -offset.x + '')
        })

      this.get('dom').setAttribute(
        'transform',
        `translate(${offset.x}, ${this.options.headerHeight + this.options.padding})`
      )
    }
  }

  private setupDates() {
    this.setBoundingDates()
    this.convertDates()
    this.fillDates()
    ;(<string[]>['header', 'background']).forEach((k: string) =>
      this.get(k).set('width', this.getWidth()).set('height', this.getHeight())
    )
  }

  private fillDates() {
    const dates: dayjs.Dayjs[] = []

    let d: dayjs.Dayjs = null
    do {
      if (!d) {
        d = dayjs(this.get('start'))
      } else if (VIEW_MODE.YEAR == this.options.viewMode) {
        d = d.add(1, 'year')
      } else if (VIEW_MODE.MONTH == this.options.viewMode) {
        d = d.add(1, 'month')
      } else {
        d = d.add(this.options.step, 'hour')
      }
      dates.push(d)
    } while (d.isBefore(this.get('end')))

    this.set('dates', dates)
  }

  private convertDates() {
    this.set('start', this.get('start').startOf('day'))
    this.set('end', this.get('end').startOf('day'))

    if ([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY].some((k) => k == this.options.viewMode)) {
      this.set('start', this.get('start').subtract(7, 'day'))
      this.set('end', this.get('end').add(7, 'day'))
    } else if (VIEW_MODE.MONTH == this.options.viewMode) {
      this.set('start', this.get('start').subtract(1, 'year'))
      this.set('end', this.get('end').add(1, 'year'))
    } else if (VIEW_MODE.YEAR == this.options.viewMode) {
      this.set('start', this.get('start').subtract(2, 'year'))
      this.set('end', this.get('end').add(2, 'year'))
    } else {
      this.set('start', this.get('start').subtract(1, 'month'))
      this.set('end', this.get('end').add(1, 'month'))
    }
  }

  private setBoundingDates() {
    this.get('tasks').forEach((task: Task) => {
      if (!this.get('start') || task.get('start').isBefore(this.get('start'))) {
        this.set('start', task.get('start').clone())
      }

      if (!this.get('end') || task.get('end').isAfter(this.get('end'))) {
        this.set('end', task.get('end').clone())
      }
    })
  }

  private getWidth(): number {
    return this.get('dates').length * this.options.columnWidth + this.options.padding
  }

  private getHeight(): number {
    return (
      this.options.headerHeight +
      this.get('tasks')
        .map((t: Task) => t.get('height'))
        .reduce((a: number, b: number) => a + b + this.options.padding) +
      this.options.padding +
      6
    )
  }

  public render(parent: SVGElementX) {
    parent.setAttribute('width', `${this.getWidth()}`)
    parent.setAttribute('height', `${this.getHeight()}`)

    this.renderStage2(parent, this.options.padding * this.get('columns').length)
    this.drawColumns(parent)
  }

  private renderStage2(parent: SVGElementX, width: number) {
    this.set(
      'dom',
      svg('g', {
        class: 'bar',
        prepend_to: parent
      })
    )

    const offset: Offset = {
      x: width,
      y: 0
    }

    this.get('background').render(parent, offset, this.get('dates'), this.get('tasks'))
    this.get('header').render(parent, offset, this.get('dates'))

    offset.y = 0
    this.get('tasks').forEach((t: Task) => {
      t.render(this.get('dom'), this.get('start'), offset)
      offset.y += t.get('height') + this.options.padding
    })
  }

  private drawColumns(parent: SVGElementX) {
    const layer = svg('g', {
      class: 'columns',
      append_to: parent
    })

    const columnsLayer = svg('g', { append_to: layer })

    const offset: Offset = { x: this.options.padding, y: 0 }

    this.get('columns').forEach((col: Column) => {
      col.render(columnsLayer, offset)
    })
  }
}
