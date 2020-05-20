import Bar, { BarOptions } from './bar'
import Milestone, { MilestoneOptions } from './milestone'

import { SVGElementX } from './types'
import { TimelineOptions } from './timeline'
import dayjs from 'dayjs'
import { svg } from './util'

export interface HtmlProducer {
  (target: Task | Bar | Milestone): string
}

export interface SingleBarOptions extends TaskBaseOptions {
  plan: BarOptions
  milestones?: MilestoneOptions[]
}

export interface MultiBarOptions extends TaskBaseOptions {
  plans: BarOptions[][]
  milestones?: MilestoneOptions[][]
}

interface TaskBaseOptions {
  id: string
  name: string
  customClass?: string
}

export type TaskOptions = SingleBarOptions & MultiBarOptions

function generate_id(task: Task) {
  return task.name + '_' + Math.random().toString(36).slice(2, 12)
}

function isSingle(options: TaskOptions): boolean {
  return 'plan' in options
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

  private _plans: Bar[][] = []
  private _milestones: Milestone[][] = []

  constructor(options: TimelineOptions, config: TaskOptions) {
    this.options = options
    this.config = { ...config }

    this._height = 0

    if (!this._id) {
      this._id = generate_id(this)
    }

    if (isSingle(config)) {
      this._plans = [[new Bar(options, config.plan, this)]]
      this._milestones = [
        (<MilestoneOptions[]>config.milestones).map((m) => new Milestone(options, m))
      ]
    } else {
      let rowOffsets: number[] = []
      this._plans = config.plans.map((bo, idx) => {
        const arr = bo.map((b) => {
          if (idx > 0) b.y = rowOffsets[idx - 1]
          return new Bar(options, b, this)
        })
        const max = Math.max(...arr.map((b) => b.height))
        rowOffsets.push(max)
        return arr
      })

      this._milestones = (<MilestoneOptions[][]>config.milestones).map((m, idx) =>
        m.map((m2) => {
          if (idx > 0 && rowOffsets[idx - 1]) m2.y = rowOffsets[idx - 1]
          return new Milestone(options, m2)
        })
      )
    }

    this.computeHeight()
    this.computeBoundingDates()
  }

  private computeHeight() {
    this._height = this._plans
      .map((a) => Math.max(...a.map((p) => p.height)))
      .reduce((a, b) => a + b, 0)
    this._plans.forEach((a) => a.forEach((p) => (this._height = Math.max(this._height, p.height))))
  }

  private computeBoundingDates() {
    if (!this._end) {
      this._end = this._plans[0][0].end.clone()
    }

    this._plans.forEach((a) =>
      a.forEach((p) => {
        if (!this._start || p.start.isBefore(this._start)) {
          this._start = p.start.clone()
        }

        if (!this._end || p.end.isAfter(this._end)) {
          this._end = p.end.clone()
        }
      })
    )

    this._milestones.forEach((a) =>
      a.forEach((p) => {
        if (!this._start || p.date.isBefore(this._start)) {
          this._start = p.date.clone()
        }

        if (!this._end || p.date.isAfter(this._end)) {
          this._end = p.date.clone()
        }
      })
    )
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, x: number, y: number) {
    console.log(this._height)
    const barGroup = svg('g', {
      class: 'bar',
      append_to: layer
    })

    const milestoneGroup = svg('g', {
      class: `milestone-wrapper ${this.config.customClass || ''}`,
      'data-id': this.id,
      append_to: layer
    })

    this._plans.forEach((row) => row.forEach((p) => p.render(barGroup, startDate, x, y)))
    this._milestones.forEach((row) => row.forEach((m) => m.render(milestoneGroup, startDate, x, y)))
  }
}
