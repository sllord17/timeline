import { Offset, SVGElementX } from '../types'
import { svg, toTextFragment } from '../util'

import { EVENT } from '../events'
import Prop from '../prop'
import Task from './Task'
import { VIEW_MODE } from '../view'
import { ViewOptions } from '../view'
import dayjs from 'dayjs'

interface BasePlanOptions {
  progress?: number
  height?: number
  start: string
  end: string
  label: string
  cornerRadius?: number
  progressStyle?: ElementCSSInlineStyle
  backgroundStyle?: ElementCSSInlineStyle
  labelStyle?: ElementCSSInlineStyle
}

export type PlanOptions = BasePlanOptions & Offset

const defaultPlanOptions: PlanOptions = {
  cornerRadius: 0,
  progress: 100,
  y: 0,
  start: '1900-01-01',
  end: '1900-01-01',
  label: ''
}

export default class Plan extends Prop implements EventListenerObject {
  private options: ViewOptions
  private task: Task

  constructor(options: ViewOptions, config: PlanOptions, task: Task) {
    super({ ...defaultPlanOptions, ...config })

    this.options = options
    this.task = task
    this.set('height', config.height || options.barHeight)

    console.assert(!!config.start, 'Plan must have a start date')
    console.assert(!!config.end, 'Plan must have an end date')

    this.set('start', dayjs(config.start))
    this.set('end', dayjs(config.end))

    // if hours is not set, assume the last day is full day
    // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
    if (this.get('end').isSame(this.get('end').startOf('day'))) {
      this.set('end', this.get('end').add(24, 'hour'))
    }

    const duration = this.get('end').diff(this.get('start'), 'hour') / this.options.step
    this.set('width', duration * this.options.columnWidth)
  }

  private computeX(startDate: dayjs.Dayjs): number {
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.get('start').diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (
      (this.get('start').diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
    )
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, offset: Offset) {
    this.set('x', this.computeX(startDate) + offset.x)
    this.set('y', this.get('y') + offset.y)

    this.set(
      'dom',
      svg('g', {
        class: 'bar-wrapper',
        'data-id': this.task.get('id'),
        append_to: layer
      })
    )

    const barGroup = svg('g', {
      class: 'bar-group',
      append_to: this.get('dom')
    })

    if (this.options.popup) {
      barGroup.addEventListener('click', this, false)
    }

    this.drawBar(barGroup)
    this.drawProgressBar(barGroup)
    this.drawLabel(barGroup)
  }

  private drawBar(layer: SVGElementX) {
    this.set(
      'bar',
      svg('rect', {
        x: this.get('x'),
        y: this.get('y'),
        width: this.get('width'),
        height: this.get('height'),
        rx: this.get('cornerRadius'),
        ry: this.get('cornerRadius'),
        class: 'bar',
        append_to: layer
      })
    )

    if (this.get('backgroundStyle')) {
      const style = this.get('backgroundStyle')
      this.get('rect').applyStyle(style)
    }
  }

  private drawProgressBar(layer: SVGElementX) {
    const rect = svg('rect', {
      x: this.get('x'),
      y: this.get('y'),
      width: this.get('width') * (this.get('progress') / 100) || 0,
      height: this.get('height'),
      rx: this.get('cornerRadius'),
      ry: this.get('cornerRadius'),
      class: 'bar-progress',
      append_to: layer
    })

    if (this.get('progressStyle')) {
      const style = this.get('progressStyle')
      rect.applyStyle(style)
    }
  }

  private drawLabel(layer: SVGElementX) {
    if (!this.get('label')) return

    this.set(
      'text',
      svg('text', {
        x: this.get('x') + this.get('width') / 2,
        y: this.get('y') + this.get('height') / 2,
        class: 'bar-label',
        append_to: layer
      })
    )

    if (this.get('labelStyle')) {
      const style = this.get('labelStyle')
      this.get('text').applyStyle(style)
    }

    this.get('text').appendChild(toTextFragment(this.get('label')))
    requestAnimationFrame(() => this.updateLabelPosition())
  }

  private updateLabelPosition() {
    if (this.get('text').getBBox().width > this.get('bar').getWidth()) {
      this.get('text').classList.add('big')
      this.get('text').setAttribute(
        'x',
        this.get('bar').getX() + this.get('bar').getWidth() + 5 + ''
      )
    } else {
      this.get('text').classList.remove('big')
      this.get('text').setAttribute(
        'x',
        this.get('bar').getX() + this.get('bar').getWidth() / 2 + ''
      )
    }
  }

  // TODO: Support events better
  handleEvent(evt: Event): void {
    const key = evt.type
    if (key == 'click' && this.options.popup) {
      this.options.dispatch(EVENT.SHOW_POPUP, {
        eventTarget: this,
        positionTarget: this.get('dom'),
        title: this.task.get('name'),
        subtitle: this.get('start').format('MMM DD') + ' - ' + this.get('end').format('MMM DD')
      })

      return
    }

    if (!this.options.events || !this.options.events[key]) throw new Error('Event not implemented.')

    this.options.events[key].call(this, evt)
  }
}
