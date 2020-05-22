import { ImageOptions, Offset, SVGElementX } from '../types'

import { EVENT } from '../events'
import Prop from '../prop'
import Task from './Task'
import { VIEW_MODE } from '../view'
import { ViewOptions } from '../view'
import dayjs from 'dayjs'
import { svg } from '../util'

interface MilestoneBaseOptions {
  date: string
}

export type MilestoneOptions = MilestoneBaseOptions & ImageOptions & Offset

const defaultMilestoneOptions: MilestoneOptions = Object.freeze({
  height: 16,
  width: 16,
  date: null,
  href: '',
  y: 0
})

export default class Milestone extends Prop implements EventListenerObject {
  private options: ViewOptions
  private task: Task

  private dom: SVGElementX

  constructor(options: ViewOptions, config: MilestoneOptions, task: Task) {
    super({ ...defaultMilestoneOptions, ...config })

    this.options = options
    this.task = task

    this.set('date', dayjs(config.date))
  }

  // TODO: Support events better
  handleEvent(evt: Event): void {
    const key = evt.type
    if (key == 'click' && this.options.popup) {
      this.options.dispatch(EVENT.SHOW_POPUP, {
        eventTarget: this,
        positionTarget: this.dom,
        title: this.task.get('name'),
        subtitle: this.get('date').format('MMM DD')
      })

      return
    }

    if (!this.options.events || !this.options.events[key]) throw new Error('Event not implemented.')

    this.options.events[key].call(this, evt)
  }

  private computeX(startDate: dayjs.Dayjs): number {
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.get('date').diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (this.get('date').diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, offset: Offset) {
    this.dom = svg('image', {
      x: this.computeX(startDate) + offset.x,
      y: this.get('y') + offset.y,
      width: this.get('width'),
      height: this.get('height'),
      href: this.get('href'),
      append_to: layer
    })

    if (this.options.popup) {
      this.dom.addEventListener('click', this, false)
    }
  }
}
