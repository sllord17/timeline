/** @module timeline */

import './gantt.scss'
import './prototypes.js'
import 'promise-polyfill/src/polyfill'

import { HtmlProducer, TaskOptions } from './task'
import Popup, { PopupOptions } from './popup'
import { delegate, svg } from './util'

import { ColumnOptions } from './grid/Column'
import { EVENT } from './events'
import Grid from './grid/Grid'
import { SVGElementX } from './types'

export enum VIEW_MODE {
  QUARTER_DAY = 'Quarter Day',
  HALF_DAY = 'Half Day',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
}

interface events {
  [key: string]: { (event: Event): void }
}

export interface ViewOptions {
  headerHeight?: number
  columnWidth?: number
  step?: number
  viewModes?: VIEW_MODE[]
  barHeight?: number
  padding?: number
  viewMode?: VIEW_MODE
  dateFormat?: string
  popup?: true
  popupProducer?: HtmlProducer
  events?: events
  dispatch?: { (key: EVENT, paylod?: PopupOptions): void }
  columns: ColumnOptions[]
}

class View {
  private options: ViewOptions = {
    headerHeight: 50,
    columnWidth: 30,
    step: 24,
    barHeight: 20,
    padding: 18,
    viewMode: VIEW_MODE.DAY,
    dateFormat: 'YYYY-MM-DD',
    popup: true,
    popupProducer: null,
    events: null,
    columns: []
  }

  private svg: SVGElementX
  private container: HTMLDivElement

  private grid: Grid
  private popup: Popup

  constructor(selector: string, tasks: TaskOptions[], options: ViewOptions) {
    this.options = { ...this.options, ...options }

    this.options.dispatch = this.dispatch.bind(this)

    const parent = document.querySelector(selector)
    this.container = document.createElement('div')
    this.container.style.overflow = 'auto'
    this.container.style.position = 'relative'
    this.container.style.paddingBottom = '100px'

    this.svg = svg('svg', {
      class: 'gantt'
    })

    parent.appendChild(this.container)
    this.container.appendChild(this.svg)

    this.grid = new Grid(this.options, tasks)

    this.render()

    const popupContainer = document.createElement('div')
    popupContainer.classList.add('popup-wrapper')
    this.container.appendChild(popupContainer)

    this.popup = new Popup(this.options, popupContainer)
    delegate(this.svg, 'click', '.grid-row, .grid-header', () => {
      this.popup.hide()
    })
    this.popup.hide()
  }

  public render() {
    this.grid.render(this.svg)
  }

  private dispatch(key: EVENT, payload?: PopupOptions): void {
    switch (key) {
      case EVENT.SHOW_POPUP:
        this.popup.show(payload)
        break
      case EVENT.HIDE_POPUP:
        this.popup.hide()
        break
    }
  }
}

export default View
