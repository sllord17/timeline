import { Consumer, EVENT } from './events'
import Popup, { PopupOptions } from './Popup'
import { TaskOptions, ViewOptions } from './options'
import { delegate, svg } from './util'

import Grid from './grid/Grid'
import Prop from './prop'
import { VIEW_MODE } from './types'

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

  private consumers: { [key: string]: Consumer[] } = {}

  constructor(selector: string, tasks: TaskOptions[], options: ViewOptions) {
    super({
      dom: svg('svg', {
        class: 'gantt'
      }),
      container: document.createElement('div')
    })

    this.options = { ...this.options, ...options }
    this.options.dispatch = this.dispatch.bind(this)
    this.options.subscribe = this.subscribe.bind(this)
    this.options.unsubscribe = this.unsubscribe.bind(this)
    this.updateScale()

    const parent = document.querySelector(selector)
    const container = this.get('container')
    container.style.overflow = 'hidden'
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
    requestAnimationFrame(() => this.dispatch(EVENT.AFTER_RENDER))
  }

  private subscribe(key: EVENT, clazz: Consumer) {
    if (!this.consumers[key]) {
      this.consumers[key] = []
    }
    this.consumers[key].push(clazz)
  }

  private unsubscribe(key: EVENT, clazz: Consumer) {
    const idx = this.consumers[key].indexOf(clazz)
    if (idx > -1) {
      this.consumers[key].splice(idx, 1)
    }
  }

  private dispatch(key: EVENT, payload?: PopupOptions): void {
    switch (key) {
      case EVENT.SHOW_POPUP:
        this.get('popup').show(payload)
        return
      case EVENT.HIDE_POPUP:
        this.get('popup').hide()
        return
    }

    const events = this.consumers[key]
    if (!events || events.length == 0) {
      return
    }

    events.forEach((c) => c.eventHandler(key))
  }

  private updateScale() {
    const mode = this.options.viewMode
    if (mode === VIEW_MODE.DAY) {
      this.options.step = 24
      this.options.columnWidth = 38
    } else if (mode === VIEW_MODE.HALF_DAY) {
      this.options.step = 24 / 2
      this.options.columnWidth = 38
    } else if (mode === VIEW_MODE.QUARTER_DAY) {
      this.options.step = 24 / 4
      this.options.columnWidth = 38
    } else if (mode === VIEW_MODE.WEEK) {
      this.options.step = 24 * 7
      this.options.columnWidth = 140
    } else if (mode === VIEW_MODE.MONTH) {
      this.options.step = 24 * 30
      this.options.columnWidth = 120
    } else if (mode === VIEW_MODE.YEAR) {
      this.options.step = 24 * 365
      this.options.columnWidth = 120
    }
  }
}
