import { svg, toTextFragment } from './util'

import { EVENT } from './events'
import { SVGElementX } from './types'
import Task from './task'
import { TimelineOptions } from './timeline'
import { VIEW_MODE } from './view'
import dayjs from 'dayjs'

export default class Bar implements EventListenerObject {
  private options: TimelineOptions
  private task: Task

  private width: number

  private x: number
  private y: number

  private bar: SVGElementX
  private label: SVGElementX
  private group: SVGElementX

  constructor(options: TimelineOptions, task: Task) {
    this.options = options
    this.task = task

    const duration = this.task.end.diff(this.task.start, 'hour') / this.options.step
    this.width = duration * this.options.columnWidth
  }

  private computeX(startDate: dayjs.Dayjs): number {
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.task.start.diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (this.task.start.diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, y: number) {
    this.x = this.computeX(startDate)
    this.y = y

    this.group = svg('g', {
      class: `bar-wrapper ${this.task.customClass || ''}`,
      'data-id': this.task.id,
      append_to: layer
    })

    const barGroup = svg('g', {
      class: 'bar-group',
      append_to: this.group
    })

    if (this.options.popup) {
      barGroup.addEventListener('click', this, false)
    }

    this.drawBar(barGroup)
    this.drawProgressBar(barGroup)
    this.drawLabel(barGroup)
  }

  private drawBar(layer: SVGElementX) {
    this.bar = svg('rect', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.task.height,
      rx: this.options.barCornerRadius,
      ry: this.options.barCornerRadius,
      class: 'bar',
      append_to: layer
    })
  }

  private drawProgressBar(layer: SVGElementX) {
    svg('rect', {
      x: this.x,
      y: this.y,
      width: this.width * (this.task.progress / 100) || 0,
      height: this.task.height,
      rx: this.options.barCornerRadius,
      ry: this.options.barCornerRadius,
      class: 'bar-progress',
      append_to: layer
    })
  }

  private drawLabel(layer: SVGElementX) {
    this.label = svg('text', {
      x: this.x + this.width / 2,
      y: this.y + this.task.height / 2,
      class: 'bar-label',
      append_to: layer
    })

    this.label.appendChild(toTextFragment(this.task.name))
    requestAnimationFrame(() => this.updateLabelPosition())
  }

  private updateLabelPosition() {
    if (this.label.getBBox().width > this.bar.getWidth()) {
      this.label.classList.add('big')
      this.label.setAttribute('x', this.bar.getX() + this.bar.getWidth() + 5 + '')
    } else {
      this.label.classList.remove('big')
      this.label.setAttribute('x', this.bar.getX() + this.bar.getWidth() / 2 + '')
    }
  }

  handleEvent(evt: Event): void {
    const key = evt.type
    if (key == 'click' && this.options.popup) {
      this.options.dispatch(EVENT.SHOW_POPUP, {
        eventTarget: this,
        positionTarget: this.group,
        title: this.task.name,
        subtitle: this.task.start.format('MMM DD') + ' - ' + this.task.end.format('MMM DD')
      })
    }

    if (!this.options.events || !this.options.events[key]) throw new Error('Event not implemented.')

    this.options.events[key].call(this, evt)
  }
}
