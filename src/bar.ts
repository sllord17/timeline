import { Offset, SVGElementX } from './types'
import { svg, toTextFragment } from './util'

import { EVENT } from './events'
import Task from './task'
import { TimelineOptions } from './timeline'
import { VIEW_MODE } from './view'
import dayjs from 'dayjs'

export interface BarOptions {
  progress?: number
  height?: number
  start: string
  end: string
  label: string
  y: number
  text: string
  style: ElementCSSInlineStyle
}

export default class Bar implements EventListenerObject {
  private options: TimelineOptions
  private config: BarOptions

  private task: Task

  private width: number

  private x: number
  private y: number

  private bar: SVGElementX
  private label: SVGElementX
  private group: SVGElementX

  private _end: dayjs.Dayjs
  get end(): dayjs.Dayjs {
    return this._end
  }

  private _start: dayjs.Dayjs
  get start(): dayjs.Dayjs {
    return this._start
  }

  private _height: number
  get height(): number {
    return this._height
  }

  constructor(options: TimelineOptions, config: BarOptions, task: Task) {
    this.options = options
    this.config = { ...config }
    this.task = task
    this._height = config.height || options.barHeight

    this._start = dayjs(config.start)
    this._end = dayjs(config.end)

    this.config.progress = config.progress ?? 100
    this.config.y = config.y ?? 0

    // // make task invalid if duration too large
    if (this._end.diff(this._start, 'year') > 10) {
      this._end = null
    }

    // invalid dates
    if (!this._start && !this._end) {
      this._start = dayjs().startOf('day')
      this._end = this._start.add(2, 'day')
    }

    if (!this._start && this._end) {
      this._start = this._end.subtract(2, 'day')
    }

    if (this._start && !this._end) {
      this._end = this._start.add(2, 'day')
    }

    // if hours is not set, assume the last day is full day
    // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
    if (this._end.isSame(this._end.startOf('day'))) {
      this._end = this._end.add(24, 'hour')
    }

    const duration = this.end.diff(this.start, 'hour') / this.options.step
    this.width = duration * this.options.columnWidth
  }

  private computeX(startDate: dayjs.Dayjs): number {
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.start.diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (this.start.diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, offset: Offset) {
    this.x = this.computeX(startDate) + offset.x
    this.y = this.config.y + offset.y

    this.group = svg('g', {
      class: 'bar-wrapper',
      'data-id': this.task.get('id'),
      append_to: layer
    })

    console.log(this.config.style)

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
      height: this.height,
      rx: this.options.barCornerRadius,
      ry: this.options.barCornerRadius,
      class: 'bar',
      append_to: layer
    })
  }

  private drawProgressBar(layer: SVGElementX) {
    const rect = svg('rect', {
      x: this.x,
      y: this.y,
      width: this.width * (this.config.progress / 100) || 0,
      height: this.height,
      rx: this.options.barCornerRadius,
      ry: this.options.barCornerRadius,
      class: 'bar-progress',
      append_to: layer
    })

    if (this.config.style) {
      Object.keys(this.config.style).forEach((k) => (rect.style[k] = this.config.style[k]))
    }
  }

  private drawLabel(layer: SVGElementX) {
    if (!this.config.text) return

    this.label = svg('text', {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      class: 'bar-label',
      append_to: layer
    })

    this.label.appendChild(toTextFragment(this.config.text))
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

  // TODO: Support events better
  handleEvent(evt: Event): void {
    const key = evt.type
    if (key == 'click' && this.options.popup) {
      this.options.dispatch(EVENT.SHOW_POPUP, {
        eventTarget: this,
        positionTarget: this.group,
        title: this.task.get('name'),
        subtitle:
          this.task.get('start').format('MMM DD') + ' - ' + this.task.get('end').format('MMM DD')
      })

      return
    }

    if (!this.options.events || !this.options.events[key]) throw new Error('Event not implemented.')

    this.options.events[key].call(this, evt)
  }
}
