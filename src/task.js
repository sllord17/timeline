/** @module Task  */

import date_utils from './date_utils'
import Bar from './bar'
import Internal from './internal'
import { createSVG } from './svg_utils'
import Milestone from './milestone'

function generate_id(task) {
  return task.name + '_' + Math.random().toString(36).slice(2, 12)
}

/**
 * @class
 * @property {Date} start The start date of the task
 * @property {Date} end The end date of the task
 * @property {string} name The name of the task
 * @property {string} id The ID of the task. One is generated if not provided.
 */
export default class Task extends Internal {
  constructor(gantt, opts) {
    super(gantt)
    this.start = date_utils.parse(opts.start)
    this.end = date_utils.parse(opts.end)
    this.progress = opts.progress
    this.name = opts.name
    this.height = opts.height || this.getOption('bar_height')
    this.milestones = opts.milestones || []
    this.custom_class = opts.custom_class

    // make task invalid if duration too large
    if (date_utils.diff(this.end, this.start, 'year') > 10) {
      this.end = null
    }

    // invalid dates
    if (!this.start && !this.end) {
      this.start = date_utils.today()
      this.end = date_utils.add(this.start, 2, 'day')
    }

    if (!this.start && this.end) {
      this.start = date_utils.add(this.end, -2, 'day')
    }

    if (this.start && !this.end) {
      this.end = date_utils.add(this.start, 2, 'day')
    }

    // if hours is not set, assume the last day is full day
    // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
    const task_end_values = date_utils.get_date_values(this.end)
    if (task_end_values.slice(3).every((d) => d === 0)) {
      this.end = date_utils.add(this.end, 24, 'hour')
    }

    // invalid flag
    if (!this.start || !this.end) {
      this.invalid = true
    }

    this.id = opts.id
    if (!this.id) {
      this.id = generate_id(this)
    }
  }

  render() {
    this.milestone_group = createSVG('g', {
      class: `milestone-wrapper ${this.custom_class || ''}`,
      'data-id': this.id
    })

    this.make_bars()
    this.make_milestones()
  }

  make_bars() {
    const bar = new Bar(this.gantt, this),
      layer = this.getLayer('bar')

    layer.appendChild(bar.group)
    layer.appendChild(this.milestone_group)
  }

  make_milestones() {
    this.$milestones = this.milestones.map((m) => new Milestone(this.gantt, this, m))
  }
}
