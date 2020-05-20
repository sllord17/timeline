import { ImageOptions, Offset, SVGElementX } from './types'

import { EVENT } from './events'
import Prop from './prop'
import Task from './task'
import { TimelineOptions } from './timeline'
import { VIEW_MODE } from './view'
import dayjs from 'dayjs'
import { svg } from './util'

interface MilestoneBaseOptions {
  date: string
}

export type MilestoneOptions = MilestoneBaseOptions & ImageOptions & Offset

export default class Milestone extends Prop implements EventListenerObject {
  private href: string
  private height: number
  private width: number
  private _date: dayjs.Dayjs

  private options: TimelineOptions
  private config: MilestoneOptions
  private task: Task

  public get date(): dayjs.Dayjs {
    return this._date
  }

  private dom: SVGElementX

  constructor(options: TimelineOptions, config: MilestoneOptions, task: Task) {
    super()

    this.options = options
    this.config = { ...config }
    this.task = task

    this.config.y = config.y ?? 0

    this.href = config.href
    this.height = config.height || 16
    this.width = config.width || 16
    this._date = dayjs(config.date)
  }

  // TODO: Support events better
  handleEvent(evt: Event): void {
    const key = evt.type
    if (key == 'click' && this.options.popup) {
      this.options.dispatch(EVENT.SHOW_POPUP, {
        eventTarget: this,
        positionTarget: this.dom,
        title: this.task.get('name'),
        subtitle: this.date.format('MMM DD')
      })

      return
    }

    if (!this.options.events || !this.options.events[key]) throw new Error('Event not implemented.')

    this.options.events[key].call(this, evt)
  }

  private computeX(startDate: dayjs.Dayjs): number {
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.date.diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (this.date.diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, offset: Offset) {
    this.dom = svg('image', {
      x: this.computeX(startDate) + offset.x,
      y: this.config.y + offset.y,
      width: this.width,
      height: this.height,
      href: this.href,
      append_to: layer
    })

    if (this.options.popup) {
      this.dom.addEventListener('click', this, false)
    }
  }
}
