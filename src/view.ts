import { Consumer, EVENT } from './events'
import Popup, { PopupOptions } from './Popup'
import { TaskOptions, ViewOptions } from './options'
import { delegate, svg, toDom } from './util'

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
    columns: [],
    draggable: true,
    parent: null
  }

  private consumers: { [key: string]: Consumer[] } = {}

  constructor(selector: string, tasks: TaskOptions[], options: ViewOptions) {
    super()

    options.parent = document.querySelector(selector)

    this.options = { ...this.options, ...options }
    this.options.dispatch = this.dispatch.bind(this)
    this.options.subscribe = this.subscribe.bind(this)
    this.options.unsubscribe = this.unsubscribe.bind(this)

    const popupContainer = document.createElement('div')
    popupContainer.classList.add('popup-wrapper')
    options.parent.appendChild(popupContainer)

    options.parent.style.display = 'flex'
    options.parent.style.flexDirection = 'row'
    options.parent.style.flex = '1'
    options.parent.style.pointerEvents = 'auto'
    options.parent.classList.add('timeline-container')

    options.parent.addEventListener('wheel', (event: MouseWheelEvent) => {
      if (!event.shiftKey) return

      const views = Object.values(VIEW_MODE)
      const direction = event.deltaY > 0 ? 1 : -1
      const idx = views.indexOf(this.options.viewMode)
      const newIdx = Math.max(0, Math.min(idx + direction, views.length - 1))

      this.changeView(views[newIdx] as VIEW_MODE)
    })

    this.set('popup', new Popup(this.options, popupContainer))
    this.get('popup').hide()

    this.setupView()
    this.set('grid', new Grid(this.options, tasks))

    this.updateScale()
    this.render()

    console.log(this)
  }

  private setupView() {
    const headerHeight = this.options.headerHeight + 10
    const left = toDom(`<div class="timeline-left" style="flex-direction: column; display: flex; overflow: hidden">
      <div class="timeline-left-top" style="overflow: hidden" height="${headerHeight}"><svg x="0" y="0" height="${headerHeight}"></svg></div>
      <div class="timeline-left-bottom" style="overflow: hidden; flex: 1"><svg x="0" y="0"></svg></div>
      </div>`)

    const right = toDom(`<div class="timeline-right" style="flex: 1; flex-direction: column; display: flex; overflow: hidden">
    <div class="timeline-right-top" style="overflow: hidden" height="${headerHeight}"><svg class="timeline" x="0" y="0" height="${headerHeight}"></svg></div>
    <div class="timeline-right-bottom" style="overflow: hidden; flex: 1"><svg class="timeline" x="0" y="0"></svg></div>
    </div>`)

    this.options.parent.append(left, right)
    this.options.parent

    delegate(
      this.options.parent,
      'click',
      '.timeline-left, .timeline-right-top, .tick, .grid',
      () => this.get('popup').hide()
    )
  }

  public changeView(mode: VIEW_MODE) {
    this.get('popup').hide()

    this.options.viewMode = mode
    this.updateScale()
    this.get('grid').setupDates()
    this.get('grid').drawBody()
    requestAnimationFrame(() => this.dispatch(EVENT.AFTER_RENDER))
  }

  public render() {
    this.get('grid').render()
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
