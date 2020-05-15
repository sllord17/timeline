import Milestone, { MilestoneOptions } from './milestone'

import Bar from './bar'
import { SVGElementX } from './types'
import { TimelineOptions } from './timeline'
import dayjs from 'dayjs'
import { svg } from './util'

export interface HtmlProducer {
  (target: Task | Bar | Milestone): string
}

export interface TaskOptions {
  start: string
  end: string
  id: string
  customClass: string
  name: string
  progress: number
  height: number
  milestones?: MilestoneOptions[]
}

function generate_id(task: Task) {
  return task.name + '_' + Math.random().toString(36).slice(2, 12)
}

export default class Task {
  private options: TimelineOptions
  private config: TaskOptions

  private _start: dayjs.Dayjs
  public get start(): dayjs.Dayjs {
    return this._start
  }

  private _end: dayjs.Dayjs
  public get end(): dayjs.Dayjs {
    return this._end
  }

  public get progress(): number {
    return this.config.progress
  }

  public get name(): string {
    return this.config.name
  }

  private _height: number
  public get height(): number {
    return this._height
  }

  private _id: string
  public get id(): string {
    return this._id
  }

  private _milestones: Milestone[] = []
  public get milestones(): Milestone[] {
    return this._milestones
  }

  public get customClass(): string {
    return this.config.customClass
  }

  constructor(options: TimelineOptions, config: TaskOptions) {
    this.options = options
    this.config = config

    this._start = dayjs(config.start)
    this._end = dayjs(config.end)
    this._height = config.height || options.barHeight

    // make task invalid if duration too large
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

    if (!this._id) {
      this._id = generate_id(this)
    }

    if (config.milestones) {
      this._milestones = config.milestones.map((m) => new Milestone(options, m))
    }
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, y: number) {
    const barGroup = svg('g', {
      class: 'bar',
      append_to: layer
    })

    const milestoneGroup = svg('g', {
      class: `milestone-wrapper ${this.customClass || ''}`,
      'data-id': this.id,
      append_to: layer
    })

    new Bar(this.options, this).render(barGroup, startDate, y)

    this._milestones.forEach((m) => m.render(milestoneGroup, startDate, y))
  }
}
