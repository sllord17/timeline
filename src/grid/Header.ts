import { svg, toTextFragment } from '../util'

import Prop from '../prop'
import { VIEW_MODE } from '../types'
import { ViewOptions } from '../options'
import dayjs from 'dayjs'

export default class Header extends Prop {
  private options: ViewOptions
  constructor(options: ViewOptions) {
    super({
      width: 0,
      height: 0
    })
    this.options = options
  }

  public render(dates: dayjs.Dayjs[]) {
    const dom = this.options.parent.querySelector('.timeline-right-top > svg')
    dom.innerHTML = ''
    dom.setAttribute('width', this.get('width') + '')
    dom.setAttribute('height', this.getHeight() + '')

    this.drawBackground(dom)
    this.drawDates(dom, dates)

    dom.setAttribute('viewBox', `0 0 ${this.get('width')} ${this.getHeight()}`)
  }

  public getHeight(): number {
    return this.options.headerHeight + 10
  }

  private drawBackground(layer: Element) {
    svg('rect', {
      x: 0,
      y: 0,
      width: this.get('width'),
      height: this.getHeight(),
      class: 'grid-header',
      append_to: layer
    })
  }

  private drawDates(layer: Element, dates: dayjs.Dayjs[]) {
    let lastDate = null
    let i: number = 0
    for (const d of dates) {
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

    let lowerDate = null,
      upperDate = null,
      lowerX = 0,
      upperX = 0

    const base_pos: { [key: string]: number } = {
      x: i * this.options.columnWidth,
      lower_y: this.options.headerHeight,
      upper_y: this.options.headerHeight - 25
    }

    const mode = this.options.step / 24
    if (mode < VIEW_MODE.DAY) {
      lowerX = (this.options.columnWidth * 1) / mode / 2
      lowerDate = date.format('HH')
      upperDate =
        date.date() !== last_date.date()
          ? date.month() !== last_date.month()
            ? date.format('D MMM')
            : date.format('D')
          : ''
    } else if (mode < VIEW_MODE.WEEK) {
      upperX = (this.options.columnWidth * VIEW_MODE.MONTH) / mode / 2
      lowerX = this.options.columnWidth / 2
      lowerDate = date.format('D')
      upperDate = date.month() !== last_date.month() ? date.format('MMMM') : ''
    } else if (mode < VIEW_MODE.MONTH) {
      upperX = (this.options.columnWidth * (28 / mode)) / 2
      lowerDate = date.month() !== last_date.month() ? date.format('D MMM') : date.format('D')
      upperDate = date.month() !== last_date.month() ? date.format('MMMM') : ''
    } else if (mode < VIEW_MODE.YEAR) {
      upperX = (this.options.columnWidth * (12 * (mode / VIEW_MODE.YEAR))) / 2
      lowerX = this.options.columnWidth / 2
      lowerDate = date.format('MMMM')
      upperDate = date.year() !== last_date.year() ? date.format('YYYY') : ''
    } else {
      upperX = (this.options.columnWidth * 30) / 2
      lowerX = this.options.columnWidth / 2
      lowerDate = date.format('YYYY')
      upperDate = date.year() !== last_date.year() ? date.format('YYYY') : ''
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
      upper_text: upperDate,
      lower_text: lowerDate,
      upper_x: base_pos.x + upperX,
      upper_y: base_pos.upper_y,
      lower_x: base_pos.x + lowerX,
      lower_y: base_pos.lower_y
    }
  }
}
