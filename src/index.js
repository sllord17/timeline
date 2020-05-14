import date_utils from './date_utils'
import { $, createSVG } from './svg_utils'
import Tasks from './tasks'
import Bar from './bar'
import Popup from './popup'

import './gantt.scss'

const VIEW_MODE = {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year'
}

SVGElement.prototype.getX = function () {
  return +this.getAttribute('x')
}
SVGElement.prototype.getY = function () {
  return +this.getAttribute('y')
}
SVGElement.prototype.getWidth = function () {
  return +this.getAttribute('width')
}
SVGElement.prototype.getHeight = function () {
  return +this.getAttribute('height')
}
SVGElement.prototype.getEndX = function () {
  return this.getX() + this.getWidth()
}

export default class Gantt {
  constructor(wrapper, tasks, options) {
    this.setup_wrapper(wrapper)
    this.setup_options(options)
    this.tasks = new Tasks(this, tasks)
    // initialize with default view mode
    this.change_view_mode()
    this.bind_events()
  }

  setup_wrapper(element) {
    let svg_element, wrapper_element

    // CSS Selector is passed
    if (typeof element === 'string') {
      element = document.querySelector(element)
    }

    // get the SVGElement
    if (element instanceof HTMLElement) {
      wrapper_element = element
      svg_element = element.querySelector('svg')
    } else if (element instanceof SVGElement) {
      svg_element = element
    } else {
      throw new TypeError(
        'Frappé Gantt only supports usage of a string CSS selector,' +
          " HTML DOM element or SVG DOM element for the 'element' parameter"
      )
    }

    // svg element
    if (!svg_element) {
      // create it
      this.$svg = createSVG('svg', {
        append_to: wrapper_element,
        class: 'gantt'
      })
    } else {
      this.$svg = svg_element
      this.$svg.classList.add('gantt')
    }

    // wrapper element
    this.$container = document.createElement('div')
    this.$container.classList.add('gantt-container')

    const parent_element = this.$svg.parentElement
    parent_element.appendChild(this.$container)
    this.$container.appendChild(this.$svg)

    // popup wrapper
    this.popup_wrapper = document.createElement('div')
    this.popup_wrapper.classList.add('popup-wrapper')
    this.$container.appendChild(this.popup_wrapper)
  }

  setup_options(options) {
    const default_options = {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_modes: [...Object.values(VIEW_MODE)],
      bar_height: 20,
      bar_corner_radius: 3,
      padding: 18,
      view_mode: 'Day',
      date_format: 'YYYY-MM-DD',
      popup_trigger: 'click',
      custom_popup_html: null,
      language: 'en'
    }
    this.options = { ...default_options, ...options }
  }

  refresh(tasks) {
    this.tasks = new Tasks(tasks, this.options)
    this.change_view_mode()
  }

  change_view_mode(mode = this.options.view_mode) {
    this.update_view_scale(mode)
    this.setup_dates()
    this.render()
    // fire viewmode_change event
    this.trigger_event('view_change', [mode])
  }

  update_view_scale(view_mode) {
    this.options.view_mode = view_mode

    if (view_mode === VIEW_MODE.DAY) {
      this.options.step = 24
      this.options.column_width = 38
    } else if (view_mode === VIEW_MODE.HALF_DAY) {
      this.options.step = 24 / 2
      this.options.column_width = 38
    } else if (view_mode === VIEW_MODE.QUARTER_DAY) {
      this.options.step = 24 / 4
      this.options.column_width = 38
    } else if (view_mode === VIEW_MODE.WEEK) {
      this.options.step = 24 * 7
      this.options.column_width = 140
    } else if (view_mode === VIEW_MODE.MONTH) {
      this.options.step = 24 * 30
      this.options.column_width = 120
    } else if (view_mode === VIEW_MODE.YEAR) {
      this.options.step = 24 * 365
      this.options.column_width = 120
    }
  }

  setup_dates() {
    this.setup_gantt_dates()
    this.setup_date_values()
  }

  setup_gantt_dates() {
    const { gantt_start, gantt_end } = this.tasks.getBoundingDates()
    this.gantt_start = gantt_start
    this.gantt_end = gantt_end

    this.gantt_start = date_utils.start_of(this.gantt_start, 'day')
    this.gantt_end = date_utils.start_of(this.gantt_end, 'day')

    // add date padding on both sides
    if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
      this.gantt_start = date_utils.add(this.gantt_start, -7, 'day')
      this.gantt_end = date_utils.add(this.gantt_end, 7, 'day')
    } else if (this.view_is(VIEW_MODE.MONTH)) {
      this.gantt_start = date_utils.start_of(this.gantt_start, 'year')
      this.gantt_end = date_utils.add(this.gantt_end, 1, 'year')
    } else if (this.view_is(VIEW_MODE.YEAR)) {
      this.gantt_start = date_utils.add(this.gantt_start, -2, 'year')
      this.gantt_end = date_utils.add(this.gantt_end, 2, 'year')
    } else {
      this.gantt_start = date_utils.add(this.gantt_start, -1, 'month')
      this.gantt_end = date_utils.add(this.gantt_end, 1, 'month')
    }
  }

  setup_date_values() {
    this.dates = []
    let cur_date = null

    while (cur_date === null || cur_date < this.gantt_end) {
      if (!cur_date) {
        cur_date = date_utils.clone(this.gantt_start)
      } else if (this.view_is(VIEW_MODE.YEAR)) {
        cur_date = date_utils.add(cur_date, 1, 'year')
      } else if (this.view_is(VIEW_MODE.MONTH)) {
        cur_date = date_utils.add(cur_date, 1, 'month')
      } else {
        cur_date = date_utils.add(cur_date, this.options.step, 'hour')
      }
      this.dates.push(cur_date)
    }
  }

  bind_events() {
    this.bind_grid_click()
  }

  render() {
    this.clear()
    this.setup_layers()
    this.make_grid()
    this.make_dates()
    this.tasks.render()
    this.set_width()
    this.set_scroll_position()
  }

  setup_layers() {
    this.layers = {}
    const layers = ['grid', 'date', 'progress', 'bar', 'details']
    // make group layers
    for (const layer of layers) {
      this.layers[layer] = createSVG('g', {
        class: layer,
        append_to: this.$svg
      })
    }
  }

  make_grid() {
    this.make_grid_background()
    this.make_grid_rows()
    this.make_grid_header()
    this.make_grid_ticks()
    this.make_grid_highlights()
  }

  make_grid_background() {
    const grid_width = this.dates.length * this.options.column_width

    const tasksHeight = this.tasks.getHeight()
    const grid_height = this.options.header_height + this.options.padding + tasksHeight

    createSVG('rect', {
      x: 0,
      y: 0,
      width: grid_width,
      height: grid_height,
      class: 'grid-background',
      append_to: this.layers.grid
    })

    $.attr(this.$svg, {
      height: grid_height,
      width: '100%'
    })
  }

  make_grid_rows() {
    const rows_layer = createSVG('g', { append_to: this.layers.grid })
    const lines_layer = createSVG('g', { append_to: this.layers.grid })

    const row_width = this.dates.length * this.options.column_width

    let row_y = this.options.header_height + this.options.padding / 2

    for (const task of this.tasks.tasks) {
      const row_height = (task.height || this.options.bar_height) + this.options.padding

      createSVG('rect', {
        x: 0,
        y: row_y,
        width: row_width,
        height: row_height,
        class: 'grid-row',
        append_to: rows_layer
      })

      createSVG('line', {
        x1: 0,
        y1: row_y + row_height,
        x2: row_width,
        y2: row_y + row_height,
        class: 'row-line',
        append_to: lines_layer
      })

      row_y += row_height
    }
  }

  make_grid_header() {
    const header_width = this.dates.length * this.options.column_width
    const header_height = this.options.header_height + 10
    createSVG('rect', {
      x: 0,
      y: 0,
      width: header_width,
      height: header_height,
      class: 'grid-header',
      append_to: this.layers.grid
    })
  }

  make_grid_ticks() {
    let tick_x = 0
    const tick_y = this.options.header_height + this.options.padding / 2
    const tick_height = this.tasks.getHeight()

    for (const date of this.dates) {
      let tick_class = 'tick'
      // thick tick for monday
      if (this.view_is(VIEW_MODE.DAY) && date.getDate() === 1) {
        tick_class += ' thick'
      }
      // thick tick for first week
      if (this.view_is(VIEW_MODE.WEEK) && date.getDate() >= 1 && date.getDate() < 8) {
        tick_class += ' thick'
      }
      // thick ticks for quarters
      if (this.view_is(VIEW_MODE.MONTH) && (date.getMonth() + 1) % 3 === 0) {
        tick_class += ' thick'
      }

      createSVG('path', {
        d: `M ${tick_x} ${tick_y} v ${tick_height}`,
        class: tick_class,
        append_to: this.layers.grid
      })

      if (this.view_is(VIEW_MODE.MONTH)) {
        tick_x += (date_utils.get_days_in_month(date) * this.options.column_width) / 30
      } else {
        tick_x += this.options.column_width
      }
    }
  }

  make_grid_highlights() {
    // highlight today's date
    if (this.view_is(VIEW_MODE.DAY)) {
      const x =
        (date_utils.diff(date_utils.today(), this.gantt_start, 'hour') / this.options.step) *
        this.options.column_width
      const y = 0

      const width = this.options.column_width

      const tasksHeight = this.tasks.getHeight()
      const grid_height = this.options.header_height + this.options.padding / 2 + tasksHeight

      createSVG('rect', {
        x,
        y,
        width,
        height: grid_height,
        class: 'today-highlight',
        append_to: this.layers.grid
      })
    }
  }

  make_dates() {
    for (const date of this.get_dates_to_draw()) {
      createSVG('text', {
        x: date.lower_x,
        y: date.lower_y,
        innerHTML: date.lower_text,
        class: 'lower-text',
        append_to: this.layers.date
      })

      if (date.upper_text) {
        const $upper_text = createSVG('text', {
          x: date.upper_x,
          y: date.upper_y,
          innerHTML: date.upper_text,
          class: 'upper-text',
          append_to: this.layers.date
        })

        // remove out-of-bound dates
        if ($upper_text.getBBox().x2 > this.layers.grid.getBBox().width) {
          $upper_text.remove()
        }
      }
    }
  }

  get_dates_to_draw() {
    let last_date = null
    const dates = this.dates.map((date, i) => {
      const d = this.get_date_info(date, last_date, i)
      last_date = date
      return d
    })
    return dates
  }

  get_date_info(date, last_date, i) {
    if (!last_date) {
      last_date = date_utils.add(date, 1, 'year')
    }
    const date_text = {
      'Quarter Day_lower': date_utils.format(date, 'HH', this.options.language),
      'Half Day_lower': date_utils.format(date, 'HH', this.options.language),
      Day_lower:
        date.getDate() !== last_date.getDate()
          ? date_utils.format(date, 'D', this.options.language)
          : '',
      Week_lower:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'D MMM', this.options.language)
          : date_utils.format(date, 'D', this.options.language),
      Month_lower: date_utils.format(date, 'MMMM', this.options.language),
      Year_lower: date_utils.format(date, 'YYYY', this.options.language),
      'Quarter Day_upper':
        date.getDate() !== last_date.getDate()
          ? date_utils.format(date, 'D MMM', this.options.language)
          : '',
      'Half Day_upper':
        // eslint-disable-next-line no-nested-ternary
        date.getDate() !== last_date.getDate()
          ? date.getMonth() !== last_date.getMonth()
            ? date_utils.format(date, 'D MMM', this.options.language)
            : date_utils.format(date, 'D', this.options.language)
          : '',
      Day_upper:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'MMMM', this.options.language)
          : '',
      Week_upper:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'MMMM', this.options.language)
          : '',
      Month_upper:
        date.getFullYear() !== last_date.getFullYear()
          ? date_utils.format(date, 'YYYY', this.options.language)
          : '',
      Year_upper:
        date.getFullYear() !== last_date.getFullYear()
          ? date_utils.format(date, 'YYYY', this.options.language)
          : ''
    }

    const base_pos = {
      x: i * this.options.column_width,
      lower_y: this.options.header_height,
      upper_y: this.options.header_height - 25
    }

    const x_pos = {
      'Quarter Day_lower': (this.options.column_width * 4) / 2,
      'Quarter Day_upper': 0,
      'Half Day_lower': (this.options.column_width * 2) / 2,
      'Half Day_upper': 0,
      Day_lower: this.options.column_width / 2,
      Day_upper: (this.options.column_width * 30) / 2,
      Week_lower: 0,
      Week_upper: (this.options.column_width * 4) / 2,
      Month_lower: this.options.column_width / 2,
      Month_upper: (this.options.column_width * 12) / 2,
      Year_lower: this.options.column_width / 2,
      Year_upper: (this.options.column_width * 30) / 2
    }

    return {
      upper_text: date_text[`${this.options.view_mode}_upper`],
      lower_text: date_text[`${this.options.view_mode}_lower`],
      upper_x: base_pos.x + x_pos[`${this.options.view_mode}_upper`],
      upper_y: base_pos.upper_y,
      lower_x: base_pos.x + x_pos[`${this.options.view_mode}_lower`],
      lower_y: base_pos.lower_y
    }
  }

  set_width() {
    const cur_width = this.$svg.getBoundingClientRect().width
    const actual_width = this.$svg.querySelector('.grid .grid-row').getAttribute('width')
    if (cur_width < actual_width) {
      this.$svg.setAttribute('width', actual_width)
    }
  }

  set_scroll_position() {
    const parent_element = this.$svg.parentElement
    if (!parent_element) return

    const hours_before_first_task = date_utils.diff(
      this.get_oldest_starting_date(),
      this.gantt_start,
      'hour'
    )

    const scroll_pos =
      (hours_before_first_task / this.options.step) * this.options.column_width -
      this.options.column_width

    parent_element.scrollLeft = scroll_pos
  }

  bind_grid_click() {
    $.on(this.$svg, this.options.popup_trigger, '.grid-row, .grid-header', () => {
      this.unselect_all()
      this.hide_popup()
    })
  }

  unselect_all() {
    ;[...this.$svg.querySelectorAll('.bar-wrapper')].forEach((el) => {
      el.classList.remove('active')
    })
  }

  view_is(modes) {
    if (typeof modes === 'string') {
      return this.options.view_mode === modes
    }

    if (Array.isArray(modes)) {
      return modes.some((mode) => this.options.view_mode === mode)
    }

    return false
  }

  show_popup(options) {
    if (!this.popup) {
      this.popup = new Popup(this.popup_wrapper, this.options.custom_popup_html)
    }
    this.popup.show(options)
  }

  hide_popup() {
    return this.popup && this.popup.hide()
  }

  trigger_event(event, args) {
    if (this.options['on_' + event]) {
      this.options['on_' + event].apply(null, args)
    }
  }

  /**
   * Gets the oldest starting date from the list of tasks
   *
   * @returns Date
   * @memberof Gantt
   */
  get_oldest_starting_date() {
    return this.tasks.tasks
      .map((task) => task.start)
      .reduce((prev_date, cur_date) => (cur_date <= prev_date ? cur_date : prev_date))
  }

  /**
   * Clear all elements from the parent svg element
   *
   * @memberof Gantt
   */
  clear() {
    this.$svg.innerHTML = ''
  }
}

Gantt.VIEW_MODE = VIEW_MODE
