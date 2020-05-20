import Bar, { BarOptions } from './bar'
import Milestone, { MilestoneOptions } from './milestone'

import { SVGElementX, Offset } from './types'
import { TimelineOptions } from './timeline'
import dayjs from 'dayjs'
import { svg } from './util'
import Prop from './prop'

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
  return 'task_' + Math.random().toString(36).slice(2, 12)
}

function isSingle(options: TaskOptions): boolean {
  return 'plan' in options
}

export default class Task extends Prop {
  private options: TimelineOptions

  private _plans: Bar[][] = []
  private _milestones: Milestone[][] = []

  constructor(options: TimelineOptions, config: TaskOptions) {
    super()

    this.options = options

    this.properties = {
      ...config,
      height: 0,
      id: generate_id(this)
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

    console.log(this)

    this.computeHeight()
    this.computeBoundingDates()
  }

  private computeHeight() {
    this.set(
      'height',
      this._plans.map((a) => Math.max(...a.map((p) => p.height))).reduce((a, b) => a + b, 0)
    )
    this._plans.forEach((a) =>
      a.forEach((p) => this.set('height', Math.max(this.get('height'), p.height)))
    )
  }

  private computeBoundingDates() {
    if (!this.get('start')) {
      this.set('start', this._plans[0][0].start.clone())
    }

    if (!this.get('end')) {
      this.set('end', this._plans[0][0].end.clone())
    }

    this._plans.forEach((a) =>
      a.forEach((p) => {
        if (!this.get('start') || p.start.isBefore(this.get('start'))) {
          this.set('start', p.start.clone())
        }

        if (!this.get('end') || p.end.isAfter(this.get('end'))) {
          this.set('end', p.end.clone())
        }
      })
    )

    this._milestones.forEach((a) =>
      a.forEach((p) => {
        if (!this.get('start') || p.date.isBefore(this.get('start'))) {
          this.set('start', p.date.clone())
        }

        if (!this.get('end') || p.date.isAfter(this.get('end'))) {
          this.set('end', p.date.clone())
        }
      })
    )
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, offset: Offset) {
    const barGroup = svg('g', {
      class: 'bar',
      append_to: layer
    })

    const milestoneGroup = svg('g', {
      class: `milestone-wrapper ${this.get('customClass') || ''}`,
      'data-id': this.get('id'),
      append_to: layer
    })

    this._plans.forEach((row) => row.forEach((p) => p.render(barGroup, startDate, offset)))
    this._milestones.forEach((row) =>
      row.forEach((m) => m.render(milestoneGroup, startDate, offset))
    )
  }
}
