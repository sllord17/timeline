import { svg, toTextFragment } from '../util'

import Prop from '../prop'
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
      last_date = date.add(1, 'year').add(1, 'day')
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
