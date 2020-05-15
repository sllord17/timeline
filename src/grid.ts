import { VIEW_MODE, viewIs } from './view'
import { svg, toTextFragment } from './util'

import { SVGElementX } from './types'
import { TaskOptions } from './task'
import Tasks from './tasks'
import { TimelineOptions } from './timeline'
import dayjs from 'dayjs'

export default class Grid {
  private options: TimelineOptions

  private _start: dayjs.Dayjs
  private _end: dayjs.Dayjs

  private dates: dayjs.Dayjs[]
  private tasks: Tasks

  constructor(options: TimelineOptions, taskOptions: TaskOptions[]) {
    this.options = options
    this.tasks = new Tasks(this.options, taskOptions)

    this.setupDates()
  }

  private setupDates() {
    this.setBoundingDates()
    this.convertDates()
    this.fillDates()
  }

  private fillDates() {
    this.dates = []

    let d: dayjs.Dayjs = null
    do {
      if (!d) {
        d = dayjs(this.start)
      } else if (viewIs([VIEW_MODE.YEAR], this.options.viewMode)) {
        d = d.add(1, 'year')
      } else if (viewIs([VIEW_MODE.MONTH], this.options.viewMode)) {
        d = d.add(1, 'month')
      } else {
        d = d.add(this.options.step, 'hour')
      }
      this.dates.push(d)
    } while (d.isBefore(this._end))
  }

  private convertDates() {
    this._start = this._start.startOf('day')
    this._end = this._end.startOf('day')

    if (viewIs([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY], this.options.viewMode)) {
      this._start = this._start.subtract(7, 'day')
      this._end = this._end.add(7, 'day')
    } else if (viewIs([VIEW_MODE.MONTH], this.options.viewMode)) {
      this._start = this._start.subtract(1, 'year')
      this._end = this._end.add(1, 'year')
    } else if (viewIs([VIEW_MODE.YEAR], this.options.viewMode)) {
      this._start = this._start.subtract(2, 'year')
      this._end = this._end.add(2, 'year')
    } else {
      this._start = this._start.subtract(1, 'month')
      this._end = this._end.add(1, 'month')
    }
  }

  private setBoundingDates() {
    this.tasks.forEach((task, idx) => {
      if (!this._start || task.start.isBefore(this._start)) {
        this._start = task.start.clone()
      }

      if (!this._end || task.end.isAfter(this._end)) {
        this._end = task.end.clone()
      }

      task.milestones.forEach((m) => {
        if (m.date.isBefore(this._start)) {
          this._start = m.date.clone()
        }

        if (m.date.isAfter(this._end)) {
          this._end = m.date.clone()
        }
      })
    })
  }

  private getWidth(): number {
    return this.dates.length * this.options.columnWidth
  }

  private getHeight(): number {
    return this.options.headerHeight + this.tasks.getHeight() + this.options.padding
  }

  public get start(): dayjs.Dayjs {
    return this._start
  }

  public set start(start: dayjs.Dayjs) {
    this._start = start
  }

  public get end(): dayjs.Dayjs {
    return this._end
  }

  public set end(end: dayjs.Dayjs) {
    this._end = end
  }

  public render(parent: SVGElementX) {
    parent.setAttribute('width', `${this.getWidth()}`)
    parent.setAttribute('height', `${this.getHeight()}`)

    const gridLayer = svg('g', {
      class: 'grid',
      append_to: parent
    })

    const dateLayer = svg('g', {
      class: 'date',
      append_to: parent
    })

    const taskLayer = svg('g', {
      class: 'bar',
      append_to: parent
    })

    this.drawBackground(gridLayer)
    this.drawRows(gridLayer)
    this.drawHeader(gridLayer)
    this.drawColumns(gridLayer)
    this.highlightCurrentDay(gridLayer)
    this.drawDates(dateLayer)

    let y = this.options.headerHeight + this.options.padding
    this.tasks.forEach((t) => {
      t.render(taskLayer, this._start, y)
      y += t.height + this.options.padding
    })
  }

  private drawBackground(layer: SVGElementX) {
    svg('rect', {
      x: 0,
      y: 0,
      width: this.getWidth(),
      height: this.getHeight(),
      class: 'grid-background',
      append_to: layer
    })
  }

  private drawRows(layer: SVGElementX) {
    const rowsLayer = svg('g', { append_to: layer })
    const linesLayer = svg('g', { append_to: layer })

    const rowWidth = this.getWidth()
    let y = this.options.headerHeight + this.options.padding / 2

    this.tasks.forEach((task) => {
      const rowHeight = task.height + this.options.padding

      svg('rect', {
        x: 0,
        y: y,
        width: rowWidth,
        height: rowHeight,
        class: 'grid-row',
        append_to: rowsLayer
      })

      svg('line', {
        x1: 0,
        y1: y + rowHeight,
        x2: rowWidth,
        y2: y + rowHeight,
        class: 'row-line',
        append_to: linesLayer
      })

      y += rowHeight
    })
  }

  private drawHeader(layer: SVGElementX) {
    svg('rect', {
      x: 0,
      y: 0,
      width: this.getWidth(),
      height: this.options.headerHeight + 10,
      class: 'grid-header',
      append_to: layer
    })
  }

  private drawColumns(layer: SVGElementX) {
    let x = 0
    const y = this.options.headerHeight + this.options.padding / 2,
      height = this.tasks.getHeight()

    for (const date of this.dates) {
      let clazz = 'tick'

      if (
        (VIEW_MODE.DAY == this.options.viewMode && date.date() == 1) ||
        (VIEW_MODE.WEEK == this.options.viewMode && date.date() >= 1 && date.date() < 8) ||
        (VIEW_MODE.MONTH == this.options.viewMode && (date.month() + 1) % 3 === 0)
      ) {
        clazz += ' thick'
      }

      svg('path', {
        d: `M ${x} ${y} v ${height}`,
        class: clazz,
        append_to: layer
      })

      if (VIEW_MODE.MONTH == this.options.viewMode) {
        x += (date.daysInMonth() * this.options.columnWidth) / 30
      } else {
        x += this.options.columnWidth
      }
    }
  }

  private highlightCurrentDay(layer: SVGElementX) {
    if (VIEW_MODE.DAY == this.options.viewMode) {
      const x = (dayjs().diff(this.start, 'hour') / this.options.step) * this.options.columnWidth

      svg('rect', {
        x,
        y: 0,
        width: this.options.columnWidth,
        height: this.getHeight(),
        class: 'today-highlight',
        append_to: layer
      })
    }
  }

  private drawDates(layer: SVGElementX) {
    let lastDate = null
    let i: number = 0
    for (const d of this.dates) {
      const date = this.getDateInfo(d, lastDate, i++)
      lastDate = d

      const lowerText = svg('text', {
        x: date.lower_x,
        y: date.lower_y,
        class: 'lower-text',
        append_to: layer
      })

      lowerText.appendChild(toTextFragment(date.lower_text))

      if (date.upper_text) {
        const upperText = svg('text', {
          x: date.upper_x,
          y: date.upper_y,
          class: 'upper-text',
          append_to: layer
        })

        upperText.appendChild(toTextFragment(date.upper_text))
        // remove out-of-bound dates
        // if ($upper_text.getBBox().x2 > this.getLayer('grid').getBBox().width) {
        //   $upper_text.remove()
        // }
      }
    }
  }

  private getDateInfo(
    date: dayjs.Dayjs,
    last_date: dayjs.Dayjs,
    i: number
  ): {
    upper_text: string
    lower_text: string
    upper_x: number
    upper_y: number
    lower_x: number
    lower_y: number
  } {
    if (!last_date) {
      last_date = date.add(1, 'year')
    }

    const date_text = {
      'Quarter Day_lower': date.format('HH'),
      'Half Day_lower': date.format('HH'),
      Day_lower: date.date() !== last_date.date() ? date.format('D') : '',
      Week_lower: date.month() !== last_date.month() ? date.format('D MMM') : date.format('D'),
      Month_lower: date.format('MMMM'),
      Year_lower: date.format('YYYY'),
      'Quarter Day_upper': date.date() !== last_date.date() ? date.format('D MMM') : '',
      'Half Day_upper':
        // eslint-disable-next-line no-nested-ternary
        date.date() !== last_date.date()
          ? date.month() !== last_date.month()
            ? date.format('D MMM')
            : date.format('D')
          : '',
      Day_upper: date.month() !== last_date.month() ? date.format('MMMM') : '',
      Week_upper: date.month() !== last_date.month() ? date.format('MMMM') : '',
      Month_upper: date.year() !== last_date.year() ? date.format('YYYY') : '',
      Year_upper: date.year() !== last_date.year() ? date.format('YYYY') : ''
    }

    const base_pos = {
      x: i * this.options.columnWidth,
      lower_y: this.options.headerHeight,
      upper_y: this.options.headerHeight - 25
    }

    const x_pos = {
      'Quarter Day_lower': (this.options.columnWidth * 4) / 2,
      'Quarter Day_upper': 0,
      'Half Day_lower': (this.options.columnWidth * 2) / 2,
      'Half Day_upper': 0,
      Day_lower: this.options.columnWidth / 2,
      Day_upper: (this.options.columnWidth * 30) / 2,
      Week_lower: 0,
      Week_upper: (this.options.columnWidth * 4) / 2,
      Month_lower: this.options.columnWidth / 2,
      Month_upper: (this.options.columnWidth * 12) / 2,
      Year_lower: this.options.columnWidth / 2,
      Year_upper: (this.options.columnWidth * 30) / 2
    }

    return {
      upper_text: date_text[`${this.options.viewMode}_upper`],
      lower_text: date_text[`${this.options.viewMode}_lower`],
      upper_x: base_pos.x + x_pos[`${this.options.viewMode}_upper`],
      upper_y: base_pos.upper_y,
      lower_x: base_pos.x + x_pos[`${this.options.viewMode}_lower`],
      lower_y: base_pos.lower_y
    }
  }
}
