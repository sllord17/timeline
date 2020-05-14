import date_utils from './date_utils'
import { createSVG } from './svg_utils'
import Internal from './internal'

export default class Milestone extends Internal {
  constructor(gantt, task, opts) {
    super(gantt)
    this.set_defaults(task, opts)
    this.prepare_values()
    this.draw()
  }

  set_defaults(task, opts) {
    this.action_completed = false
    this.task = task
    this.href = opts.href
    this.date = opts.date
    this.height = opts.height || this.getOption('bar_height')
  }

  prepare_values() {
    this.invalid = this.task.invalid
    this.x = this.compute_x()
    this.y = this.compute_y()
    this.width = 16
    this.group = this.task.milestone_group
  }

  draw() {
    this.$image = createSVG('image', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.width,
      href: this.href,
      append_to: this.group
    })
  }

  compute_x() {
    const step = this.getOption('step'),
      column_width = this.getOption('column_width')

    const task_start = this.date
    const gantt_start = this.gantt.grid.start

    const diff = date_utils.diff(task_start, gantt_start, 'hour')
    let x = (diff / step) * column_width

    if (this.gantt.grid.view_is('Month')) {
      const d = date_utils.diff(task_start, gantt_start, 'day')
      x = (d * column_width) / 30
    }
    return x
  }

  compute_y() {
    const idx = this.getTasks().entries().indexOf(this.task)
    return (
      this.getOption('header_height') +
      this.getOption('padding') +
      idx * (this.height + this.getOption('padding'))
    )
  }
}
