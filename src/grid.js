import Internal from './internal'
import { $, createSVG } from './svg_utils'
import date_utils from './date_utils'
import VIEW_MODE from './common'

export default class Grid extends Internal {
  constructor(gantt) {
    super(gantt)

    this.start = null
    this.end = null
  }

  render() {
    this.make_grid_background()
    this.make_grid_rows()
    this.make_grid_header()
    this.make_grid_ticks()
    this.make_grid_highlights()
    this.make_dates()
  }

  view_is(modes) {
    if (typeof modes === 'string') {
      return this.getOption('view_mode') === modes
    }

    if (Array.isArray(modes)) {
      return modes.some((mode) => this.getOption('view_mode') === mode)
    }

    return false
  }

  setup_dates() {
    this.setup_gantt_dates()
    this.setup_date_values()
  }

  setup_gantt_dates() {
    const { gantt_start, gantt_end } = this.getTasks().getBoundingDates()
    this.start = gantt_start
    this.end = gantt_end

    this.start = date_utils.start_of(this.start, 'day')
    this.end = date_utils.start_of(this.end, 'day')

    // add date padding on both sides
    if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
      this.start = date_utils.add(this.start, -7, 'day')
      this.end = date_utils.add(this.end, 7, 'day')
    } else if (this.view_is(VIEW_MODE.MONTH)) {
      this.start = date_utils.start_of(this.start, 'year')
      this.end = date_utils.add(this.end, 1, 'year')
    } else if (this.view_is(VIEW_MODE.YEAR)) {
      this.start = date_utils.add(this.start, -2, 'year')
      this.end = date_utils.add(this.end, 2, 'year')
    } else {
      this.start = date_utils.add(this.start, -1, 'month')
      this.end = date_utils.add(this.end, 1, 'month')
    }
  }

  setup_date_values() {
    this.dates = []
    let cur_date = null

    while (cur_date === null || cur_date < this.end) {
      if (!cur_date) {
        cur_date = date_utils.clone(this.start)
      } else if (this.view_is(VIEW_MODE.YEAR)) {
        cur_date = date_utils.add(cur_date, 1, 'year')
      } else if (this.view_is(VIEW_MODE.MONTH)) {
        cur_date = date_utils.add(cur_date, 1, 'month')
      } else {
        cur_date = date_utils.add(cur_date, this.getOption('step'), 'hour')
      }
      this.dates.push(cur_date)
    }
  }

  make_grid_background() {
    const grid_width = this.dates.length * this.getOption('column_width')

    const tasksHeight = this.getTasks().getHeight()
    const grid_height = this.getOption('header_height') + this.getOption('padding') + tasksHeight

    createSVG('rect', {
      x: 0,
      y: 0,
      width: grid_width,
      height: grid_height,
      class: 'grid-background',
      append_to: this.getLayer('grid')
    })

    $.attr(this.gantt.$svg, {
      height: grid_height,
      width: '100%'
    })
  }

  make_grid_rows() {
    const rows_layer = createSVG('g', { append_to: this.getLayer('grid') })
    const lines_layer = createSVG('g', { append_to: this.getLayer('grid') })

    const row_width = this.dates.length * this.getOption('column_width')

    let row_y = this.getOption('header_height') + this.getOption('padding') / 2

    for (const task of this.getTasks().entries()) {
      const row_height = (task.height || this.getOption('bar_height')) + this.getOption('padding')

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
    const header_width = this.dates.length * this.getOption('column_width')
    const header_height = this.getOption('header_height') + 10
    createSVG('rect', {
      x: 0,
      y: 0,
      width: header_width,
      height: header_height,
      class: 'grid-header',
      append_to: this.getLayer('grid')
    })
  }

  make_grid_ticks() {
    let tick_x = 0
    const tick_y = this.getOption('header_height') + this.getOption('padding') / 2
    const tick_height = this.getTasks().getHeight()

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
        append_to: this.getLayer('grid')
      })

      if (this.view_is(VIEW_MODE.MONTH)) {
        tick_x += (date_utils.get_days_in_month(date) * this.getOption('column_width')) / 30
      } else {
        tick_x += this.getOption('column_width')
      }
    }
  }

  make_grid_highlights() {
    // highlight today's date
    if (this.view_is(VIEW_MODE.DAY)) {
      const x =
        (date_utils.diff(date_utils.today(), this.start, 'hour') / this.getOption('step')) *
        this.getOption('column_width')
      const y = 0

      const width = this.getOption('column_width')

      const tasksHeight = this.getTasks().getHeight()
      const grid_height =
        this.getOption('header_height') + this.getOption('padding') / 2 + tasksHeight

      createSVG('rect', {
        x,
        y,
        width,
        height: grid_height,
        class: 'today-highlight',
        append_to: this.getLayer('grid')
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
        append_to: this.getLayer('date')
      })

      if (date.upper_text) {
        const $upper_text = createSVG('text', {
          x: date.upper_x,
          y: date.upper_y,
          innerHTML: date.upper_text,
          class: 'upper-text',
          append_to: this.getLayer('date')
        })

        // remove out-of-bound dates
        if ($upper_text.getBBox().x2 > this.getLayer('grid').getBBox().width) {
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
      'Quarter Day_lower': date_utils.format(date, 'HH', this.getOption('language')),
      'Half Day_lower': date_utils.format(date, 'HH', this.getOption('language')),
      Day_lower:
        date.getDate() !== last_date.getDate()
          ? date_utils.format(date, 'D', this.getOption('language'))
          : '',
      Week_lower:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'D MMM', this.getOption('language'))
          : date_utils.format(date, 'D', this.getOption('language')),
      Month_lower: date_utils.format(date, 'MMMM', this.getOption('language')),
      Year_lower: date_utils.format(date, 'YYYY', this.getOption('language')),
      'Quarter Day_upper':
        date.getDate() !== last_date.getDate()
          ? date_utils.format(date, 'D MMM', this.getOption('language'))
          : '',
      'Half Day_upper':
        // eslint-disable-next-line no-nested-ternary
        date.getDate() !== last_date.getDate()
          ? date.getMonth() !== last_date.getMonth()
            ? date_utils.format(date, 'D MMM', this.getOption('language'))
            : date_utils.format(date, 'D', this.getOption('language'))
          : '',
      Day_upper:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'MMMM', this.getOption('language'))
          : '',
      Week_upper:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'MMMM', this.getOption('language'))
          : '',
      Month_upper:
        date.getFullYear() !== last_date.getFullYear()
          ? date_utils.format(date, 'YYYY', this.getOption('language'))
          : '',
      Year_upper:
        date.getFullYear() !== last_date.getFullYear()
          ? date_utils.format(date, 'YYYY', this.getOption('language'))
          : ''
    }

    const base_pos = {
      x: i * this.getOption('column_width'),
      lower_y: this.getOption('header_height'),
      upper_y: this.getOption('header_height') - 25
    }

    const x_pos = {
      'Quarter Day_lower': (this.getOption('column_width') * 4) / 2,
      'Quarter Day_upper': 0,
      'Half Day_lower': (this.getOption('column_width') * 2) / 2,
      'Half Day_upper': 0,
      Day_lower: this.getOption('column_width') / 2,
      Day_upper: (this.getOption('column_width') * 30) / 2,
      Week_lower: 0,
      Week_upper: (this.getOption('column_width') * 4) / 2,
      Month_lower: this.getOption('column_width') / 2,
      Month_upper: (this.getOption('column_width') * 12) / 2,
      Year_lower: this.getOption('column_width') / 2,
      Year_upper: (this.getOption('column_width') * 30) / 2
    }

    return {
      upper_text: date_text[`${this.getOption('view_mode')}_upper`],
      lower_text: date_text[`${this.getOption('view_mode')}_lower`],
      upper_x: base_pos.x + x_pos[`${this.getOption('view_mode')}_upper`],
      upper_y: base_pos.upper_y,
      lower_x: base_pos.x + x_pos[`${this.getOption('view_mode')}_lower`],
      lower_y: base_pos.lower_y
    }
  }
}
