import { Offset, SVGElementX, VIEW_MODE } from '../types'
import { PlanOptions, ViewOptions } from '../options'
import { svg, toTextFragment } from '../util'

import { EVENT } from '../events'
import Prop from '../prop'
import Task from './Task'
import dayjs from 'dayjs'

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
    super({ ...defaultPlanOptions, ...config, type: 'Plan' })

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

    this.set('duration', this.get('end').diff(this.get('start'), 'hour'))
  }

  private getDuration(): number {
    return this.get('duration') / this.options.step
  }

  private getWidth(): number {
    return this.getDuration() * this.options.columnWidth
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

    this.drawBar(barGroup, offset)
    this.drawProgressBar(barGroup, offset)
    this.drawLabel(barGroup, offset)
  }

  private drawBar(layer: SVGElementX, offset: Offset) {
    this.set(
      'bar',
      svg('rect', {
        x: this.get('x'),
        y: this.get('y') + offset.y,
        width: this.getWidth(),
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

  private drawProgressBar(layer: SVGElementX, offset: Offset) {
    const rect = svg('rect', {
      x: this.get('x'),
      y: this.get('y') + offset.y,
      width: this.getWidth() * (this.get('progress') / 100) || 0,
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

  private drawLabel(layer: SVGElementX, offset: Offset) {
    if (!this.get('label')) return

    this.set(
      'text',
      svg('text', {
        x: this.get('x') + this.getWidth() / 2,
        y: this.get('y') + offset.y + this.get('height') / 2,
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
        subtitle: this.get('start').format('MMM DD') + ' - ' + this.get('end').format('MMM DD'),
        position: 'left'
      })

      return
    }
  }
}
