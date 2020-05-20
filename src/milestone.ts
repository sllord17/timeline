import { ImageOptions, SVGElementX } from './types'

import { TimelineOptions } from './timeline'
import { VIEW_MODE } from './view'
import dayjs from 'dayjs'
import { svg } from './util'

interface MilestoneBaseOptions {
  date: string
  y: number
}

export type MilestoneOptions = MilestoneBaseOptions & ImageOptions

export default class Milestone {
  private href: string
  private height: number
  private width: number
  private _date: dayjs.Dayjs

  private options: TimelineOptions
  private config: MilestoneOptions

  public get date(): dayjs.Dayjs {
    return this._date
  }

  constructor(options: TimelineOptions, config: MilestoneOptions) {
    this.options = options
    this.config = { ...config }

    this.config.y = config.y ?? 0

    this.href = config.href
    this.height = config.height || 16
    this.width = config.width || 16
    this._date = dayjs(config.date)
  }

  private computeX(startDate: dayjs.Dayjs): number {
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.date.diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (this.date.diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, x: number, y: number) {
    svg('image', {
      x: this.computeX(startDate) + x,
      y: y + this.config.y,
      width: this.width,
      height: this.height,
      href: this.href,
      append_to: layer
    })
  }
}
