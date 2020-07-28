import { SVGElementX, Offset } from '../types'
import dayjs from 'dayjs'
import { svg } from '../util'
import Prop from '../prop'
import { TaskOptions, ViewOptions, MilestoneOptions } from '../options'
import Plan from './Plan'
import Milestone from './Milestone'

function generate_id(task: Task) {
  return 'task_' + Math.random().toString(36).slice(2, 12)
}

function isSingle(options: TaskOptions): boolean {
  return 'plan' in options
}

export default class Task extends Prop {
  private options: ViewOptions

  private _plans: Plan[][] = []
  private _milestones: Milestone[][] = []

  constructor(options: ViewOptions, config: TaskOptions) {
    super()

    this.options = options

    this.properties = {
      ...config,
      height: 0,
      id: generate_id(this),
      type: 'Task'
    }

    if (isSingle(config)) {
      this._plans = [[new Plan(options, config.plan, this)]]
      this._milestones = [
        (<MilestoneOptions[]>config.milestones).map((m) => new Milestone(options, m, this))
      ]
    } else {
      let rowOffsets: number[] = []
      this._plans = config.plans.map((bo, idx) => {
        const arr = bo.map((b) => {
          if (idx > 0) b.y = rowOffsets[idx - 1]
          return new Plan(options, b, this)
        })
        const max = Math.max(...arr.map((b) => b.get('height')))
        rowOffsets.push((idx > 0 ? rowOffsets[idx - 1] : 0) + max)
        return arr
      })

      this._milestones = (<MilestoneOptions[][]>config.milestones).map((m, idx) =>
        m.map((m2) => {
          if (idx > 0 && rowOffsets[idx - 1]) m2.y = rowOffsets[idx - 1]
          return new Milestone(options, m2, this)
        })
      )
    }

    this.computeHeight()
    this.computeBoundingDates()
  }

  private computeHeight() {
    this.set(
      'height',
      this._plans.map((a, idx) => this.getRowHeight(idx)).reduce((a, b) => a + b, 0)
    )
  }

  private computeBoundingDates() {
    if (!this.get('start')) {
      this.set('start', this._plans[0][0].get('start').clone())
    }

    if (!this.get('end')) {
      this.set('end', this._plans[0][0].get('end').clone())
    }

    this._plans.forEach((a) =>
      a.forEach((p) => {
        if (!this.get('start') || p.get('start').isBefore(this.get('start'))) {
          this.set('start', p.get('start').clone())
        }

        if (!this.get('end') || p.get('end').isAfter(this.get('end'))) {
          this.set('end', p.get('end').clone().add(4, 'day'))
        }
      })
    )

    this._milestones.forEach((a) =>
      a.forEach((p) => {
        if (!this.get('start') || p.get('date').isBefore(this.get('start'))) {
          this.set('start', p.get('date').clone())
        }

        if (!this.get('end') || p.get('date').isAfter(this.get('end'))) {
          this.set('end', p.get('date').clone())
        }
      })
    )
  }

  public getRowHeight(idx: number) {
    console.assert(idx < this._plans.length, 'Row index outside of number of plan rows')

    const row = this._plans[idx]

    return Math.max(...row.map((p) => p.get('height')))
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, offset: Offset) {
    const barGroup = svg('g', {
      class: 'bar',
      append_to: layer
    })

    const milestoneGroup = svg('g', {
      class: `milestone-wrapper`,
      'data-id': this.get('id'),
      append_to: layer
    })

    this._plans.forEach((row) => row.forEach((p) => p.render(barGroup, startDate, offset)))

    this._milestones.forEach((row) =>
      row.forEach((m) => m.render(milestoneGroup, startDate, offset))
    )
  }
}
