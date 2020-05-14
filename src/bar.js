import date_utils from './date_utils'
import { $, createSVG, animateSVG } from './svg_utils'
import Milestone from './milestone'
import Internal from './internal'

export default class Bar extends Internal {
  constructor(gantt, task) {
    super(gantt)
    this.set_defaults(task)
    this.prepare_values()
    this.draw()
    this.bind()
  }

  set_defaults(task) {
    this.action_completed = false
    this.task = task
  }

  prepare_values() {
    this.invalid = this.task.invalid
    this.height = this.task.height || this.getOption('bar_height')
    this.x = this.compute_x()
    this.y = this.compute_y()
    this.corner_radius = this.getOption('bar_corner_radius')
    this.duration = date_utils.diff(this.task.end, this.task.start, 'hour') / this.getOption('step')
    this.width = this.getOption('column_width') * this.duration
    this.progress_width =
      this.getOption('column_width') * this.duration * (this.task.progress / 100) || 0
    this.group = createSVG('g', {
      class: `bar-wrapper ${this.task.custom_class || ''}`,
      'data-id': this.task.id
    })

    this.bar_group = createSVG('g', {
      class: 'bar-group',
      append_to: this.group
    })
  }

  draw() {
    this.draw_bar()
    this.draw_progress_bar()
    this.draw_label()
  }

  draw_bar() {
    this.$bar = createSVG('rect', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: 'bar',
      append_to: this.bar_group
    })

    animateSVG(this.$bar, 'width', 0, this.width)

    if (this.invalid) {
      this.$bar.classList.add('bar-invalid')
    }
  }

  draw_progress_bar() {
    if (this.invalid) return
    this.$bar_progress = createSVG('rect', {
      x: this.x,
      y: this.y,
      width: this.progress_width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: 'bar-progress',
      append_to: this.bar_group
    })

    animateSVG(this.$bar_progress, 'width', 0, this.progress_width)
  }

  draw_label() {
    createSVG('text', {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      innerHTML: this.task.name,
      class: 'bar-label',
      append_to: this.bar_group
    })
    // labels get BBox in the next tick
    requestAnimationFrame(() => this.update_label_position())
  }

  get_progress_polygon_points() {
    const bar_progress = this.$bar_progress
    return [
      bar_progress.getEndX() - 5,
      bar_progress.getY() + bar_progress.getHeight(),
      bar_progress.getEndX() + 5,
      bar_progress.getY() + bar_progress.getHeight(),
      bar_progress.getEndX(),
      bar_progress.getY() + bar_progress.getHeight() - 8.66
    ]
  }

  bind() {
    if (this.invalid) return
    this.setup_click_event()
  }

  setup_click_event() {
    $.on(this.group, `focus ${this.getOption('popup_trigger')}`, (e) => {
      if (this.action_completed) {
        // just finished a move action, wait for a few seconds
        return
      }

      if (e.type === 'click') {
        this.gantt.trigger_event('click', [this.task])
      }

      this.gantt.unselect_all()
      this.group.classList.toggle('active')

      this.show_popup()
    })
  }

  show_popup() {
    const start_date = date_utils.format(this.task.start, 'MMM D', this.getOption('language'))
    const end_date = date_utils.format(
      date_utils.add(this.task.end, -1, 'second'),
      'MMM D',
      this.getOption('language')
    )
    const subtitle = `${start_date} - ${end_date}`

    this.gantt.show_popup({
      target_element: this.$bar,
      title: this.task.name,
      subtitle,
      task: this.task
    })
  }

  set_action_completed() {
    this.action_completed = true
    setTimeout(() => {
      this.action_completed = false
    }, 1000)
  }

  compute_progress() {
    const progress = (this.$bar_progress.getWidth() / this.$bar.getWidth()) * 100
    return parseInt(progress, 10)
  }

  compute_x() {
    const step = this.getOption('step'),
      column_width = this.getOption('column_width')
    const task_start = this.task.start
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
    let sum = 0,
      idx = this.getTasks().entries().indexOf(this.task)

    for (let i = 0; i < idx; i++) {
      sum += this.getTaskIdx([i]).height + this.getOption('padding')
    }

    return this.getOption('header_height') + this.getOption('padding') + sum
  }

  update_label_position() {
    const bar = this.$bar
    const label = this.group.querySelector('.bar-label')

    if (label.getBBox().width > bar.getWidth()) {
      label.classList.add('big')
      label.setAttribute('x', bar.getX() + bar.getWidth() + 5)
    } else {
      label.classList.remove('big')
      label.setAttribute('x', bar.getX() + bar.getWidth() / 2)
    }
  }
}
