/** @module timeline/grid */

import { Offset, SVGElementX } from './types'
import { svg, toTextFragment } from './util'

import Column from './column'
import { TaskOptions } from './task'
import Tasks from './tasks'
import { TimelineOptions } from './timeline'
import { VIEW_MODE } from './view'
import dayjs from 'dayjs'

export interface ColumnOptions {
  id: string
  text: string
  field: string
  customClass?: string
}

export default class Grid {
  private options: TimelineOptions

  private _start: dayjs.Dayjs
  private _end: dayjs.Dayjs

  private dates: dayjs.Dayjs[]
  private tasks: Tasks

  private columns: Column[] = []

  constructor(options: TimelineOptions, taskOptions: TaskOptions[]) {
    this.options = options
    this.tasks = new Tasks(this.options, taskOptions)
    this.columns = options.columns.map((c) => new Column(this.options, c, this.tasks))

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
      } else if (VIEW_MODE.YEAR == this.options.viewMode) {
        d = d.add(1, 'year')
      } else if (VIEW_MODE.MONTH == this.options.viewMode) {
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

    if ([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY].some((k) => k == this.options.viewMode)) {
      this._start = this._start.subtract(7, 'day')
      this._end = this._end.add(7, 'day')
    } else if (VIEW_MODE.MONTH == this.options.viewMode) {
      this._start = this._start.subtract(1, 'year')
      this._end = this._end.add(1, 'year')
    } else if (VIEW_MODE.YEAR == this.options.viewMode) {
      this._start = this._start.subtract(2, 'year')
      this._end = this._end.add(2, 'year')
    } else {
      this._start = this._start.subtract(1, 'month')
      this._end = this._end.add(1, 'month')
    }
  }

  private setBoundingDates() {
    this.tasks.forEach((task) => {
      if (!this._start || task.start.isBefore(this._start)) {
        this._start = task.start.clone()
      }

      if (!this._end || task.end.isAfter(this._end)) {
        this._end = task.end.clone()
      }
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

    const columnLayer = svg('g', {
      class: 'columns'
    })

    this.drawColumns(columnLayer)
    parent.appendChild(columnLayer)

    requestAnimationFrame(() => this.renderStage2(parent, columnLayer.getBBox().width))

    console.log(columnLayer.getBBox())
  }

  private renderStage2(parent: SVGElementX, width: number) {
    const taskLayer = svg('g', {
      class: 'bar',
      prepend_to: parent
    })

    const dateLayer = svg('g', {
      class: 'date',
      prepend_to: parent
    })

    const gridLayer = svg('g', {
      class: 'grid',
      prepend_to: parent
    })

    const offset: Offset = {
      x: width,
      y: 0
    }

    this.drawBackground(gridLayer, offset)
    this.drawRows(gridLayer, offset)
    this.drawHeader(gridLayer, offset)
    this.drawTicks(gridLayer, offset)
    this.highlightCurrentDay(gridLayer, offset)
    this.drawDates(dateLayer, offset)

    offset.y = this.options.headerHeight + this.options.padding
    this.tasks.forEach((t) => {
      t.render(taskLayer, this._start, offset)
      offset.y += t.height + this.options.padding
    })
  }

  private drawColumns(layer: SVGElementX) {
    const columnsLayer = svg('g', { append_to: layer })

    let width = 0
    this.columns.forEach((c) => {
      c.render(columnsLayer, width)
      width += c.getWidth()
    })
  }

  private drawBackground(layer: SVGElementX, offset: Offset) {
    svg('rect', {
      x: 0,
      y: 0,
      width: this.getWidth() + offset.x,
      height: this.getHeight(),
      class: 'grid-background',
      append_to: layer
    })
  }

  private drawRows(layer: SVGElementX, offset: Offset) {
    const rowsLayer = svg('g', { append_to: layer })
    const linesLayer = svg('g', { append_to: layer })

    const rowWidth = this.getWidth() + offset.x
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

  private drawHeader(layer: SVGElementX, offset: Offset) {
    svg('rect', {
      x: offset.x,
      y: 0,
      width: this.getWidth(),
      height: this.options.headerHeight + 10,
      class: 'grid-header',
      append_to: layer
    })
  }

  private drawTicks(layer: SVGElementX, offset: Offset) {
    let x = offset.x
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

  private highlightCurrentDay(layer: SVGElementX, offset: Offset) {
    if (VIEW_MODE.DAY == this.options.viewMode) {
      const x = (dayjs().diff(this.start, 'hour') / this.options.step) * this.options.columnWidth

      svg('rect', {
        x: x + offset.x,
        y: 0,
        width: this.options.columnWidth,
        height: this.getHeight(),
        class: 'today-highlight',
        append_to: layer
      })
    }
  }

  private drawDates(layer: SVGElementX, offset: Offset) {
    let lastDate = null
    let i: number = 0
    for (const d of this.dates) {
      const date = this.getDateInfo(d, lastDate, i++)
      lastDate = d

      const lowerText = svg('text', {
        x: date.lower_x + offset.x,
        y: date.lower_y,
        class: 'lower-text',
        append_to: layer
      })

      lowerText.appendChild(toTextFragment(date.lower_text))

      if (date.upper_text) {
        const upperText = svg('text', {
          x: date.upper_x + offset.x,
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

    const date_text: { [key: string]: string } = {
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

    const base_pos: { [key: string]: number } = {
      x: i * this.options.columnWidth,
      lower_y: this.options.headerHeight,
      upper_y: this.options.headerHeight - 25
    }

    const x_pos: { [key: string]: number } = {
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
