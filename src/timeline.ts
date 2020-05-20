/** @module timeline */

import './gantt.scss'
import './prototypes.js'

import Grid, { ColumnOptions } from './grid'
import { HtmlProducer, TaskOptions } from './task'
import Popup, { PopupOptions } from './popup'
import { delegate, svg } from './util'

import { EVENT } from './events'
import { SVGElementX } from './types'
import { VIEW_MODE } from './view'

interface events {
  [key: string]: { (event: Event): void }
}

export interface TimelineOptions {
  headerHeight?: number
  columnWidth?: number
  step?: number
  viewModes?: VIEW_MODE[]
  barHeight?: number
  barCornerRadius?: number
  padding?: number
  viewMode?: VIEW_MODE
  dateFormat?: string
  popup?: true
  popupProducer?: HtmlProducer
  events?: events
  dispatch?: { (key: EVENT, paylod?: PopupOptions): void }
  columns: ColumnOptions[]
}

class Timeline {
  private options: TimelineOptions = {
    headerHeight: 50,
    columnWidth: 30,
    step: 24,
    barHeight: 20,
    barCornerRadius: 3,
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

  constructor(selector: string, tasks: TaskOptions[], options: TimelineOptions) {
    this.options = { ...this.options, ...options }

    this.options.dispatch = this.dispatch.bind(this)

    const parent = document.querySelector(selector)
    this.container = document.createElement('div')
    this.container.style.overflow = 'auto'
    this.container.style.position = 'relative'

    this.svg = svg('svg', {
      class: 'gantt'
    })

    parent.appendChild(this.container)
    this.container.appendChild(this.svg)

    this.grid = new Grid(this.options, tasks)

    this.render()

    const popupContainer = document.createElement('div')
    popupContainer.classList.add('popup-wrapper')
    popupContainer.style.opacity = '0'
    this.container.appendChild(popupContainer)

    this.popup = new Popup(this.options, popupContainer)
    delegate(this.svg, 'click', '.grid-row, .grid-header', () => {
      this.popup.hide()
    })
  }

  public render() {
    this.grid.render(this.svg)
  }

  private dispatch(key: EVENT, payload?: PopupOptions): void {
    console.log(this)
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

export default Timeline
