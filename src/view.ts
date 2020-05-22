import { HtmlProducer, SVGElementX } from './types'
import Popup, { PopupOptions } from './Popup'
import { delegate, svg } from './util'

import { ColumnOptions } from './grid/Column'
import { EVENT } from './events'
import Grid from './grid/Grid'
import Prop from './prop'
import { TaskOptions } from './task/Task'

export enum VIEW_MODE {
  QUARTER_DAY = 'Quarter Day',
  HALF_DAY = 'Half Day',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
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
  dispatch?: { (key: EVENT, paylod?: PopupOptions): void }
  columns: ColumnOptions[]
}

export default class View extends Prop {
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
    columns: []
  }

  constructor(selector: string, tasks: TaskOptions[], options: ViewOptions) {
    super({
      dom: svg('svg', {
        class: 'gantt'
      }),
      container: document.createElement('div')
    })

    this.options = { ...this.options, ...options }
    this.options.dispatch = this.dispatch.bind(this)

    const parent = document.querySelector(selector)
    const container = this.get('container')
    container.style.overflow = 'auto'
    container.style.position = 'relative'
    container.style.paddingBottom = '100px'

    parent.appendChild(container)
    container.appendChild(this.get('dom'))

    this.set('grid', new Grid(this.options, tasks))

    this.render()

    const popupContainer = document.createElement('div')
    popupContainer.classList.add('popup-wrapper')
    container.appendChild(popupContainer)

    this.set('popup', new Popup(this.options, popupContainer))
    delegate(this.get('dom'), 'click', '.grid-row, .grid-header', () => {
      this.get('popup').hide()
    })
    this.get('popup').hide()
  }

  public render() {
    this.get('grid').render(this.get('dom'))
  }

  private dispatch(key: EVENT, payload?: PopupOptions): void {
    switch (key) {
      case EVENT.SHOW_POPUP:
        this.get('popup').show(payload)
        break
      case EVENT.HIDE_POPUP:
        this.get('popup').hide()
        break
    }
  }
}
