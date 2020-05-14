import date_utils from './date_utils'
import { $, createSVG } from './svg_utils'
import Tasks from './tasks'
import Popup from './popup'
import Grid from './grid'

import VIEW_MODE from './common'
import './gantt.scss'

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
    this.grid = new Grid(this)
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
    this.grid.setup_dates()
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

  bind_events() {
    this.bind_grid_click()
  }

  render() {
    this.clear()
    this.setup_layers()
    this.grid.render()
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
      this.grid.start,
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
