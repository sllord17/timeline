/** @module timeline/grid */

import { Offset, SVGElementX, VIEW_MODE } from '../types'

import Background from './Background'
import Column from './Column'
import Header from './Header'
import Prop from '../prop'
import dayjs from 'dayjs'
import { svg } from '../util'
import { Consumer, EVENT } from '../events'
import { ViewOptions, TaskOptions } from '../options'
import Task from '../task/Task'

export default class Grid extends Prop implements Consumer {
  private options: ViewOptions
  private isPointerDown: boolean = false
  private pointerOrigin: any = { x: 0, y: 0 }
  private viewBox: any = { x: 0, y: 0 }

  constructor(options: ViewOptions, taskOptions: TaskOptions[]) {
    super({
      background: new Background(options),
      header: new Header(options),
      tasks: taskOptions.map((o) => new Task(options, o))
    })

    this.options = options
    this.options.subscribe(EVENT.AFTER_RENDER, this)

    this.set(
      'columns',
      options.columns.map((c) => new Column(this.options, c, this.get('tasks')))
    )

    this.setupDates()
  }

  eventHandler(event: EVENT): void {
    if (event == EVENT.AFTER_RENDER) {
      const offset: Offset = { x: 0, y: 0 }
      this.get('columns').forEach((c: Column, idx: number) => {
        c.get('dom').setAttribute(
          'transform',
          `translate(${offset.x + this.options.padding / 2}, ${this.options.headerHeight + 6})`
        )
        offset.x += c.getWidth() + this.options.padding
      })

      this.get('header').get('dom').setAttribute('transform', `translate(0, 0)`)
      this.get('background')
        .get('dom')
        .setAttribute('transform', `translate(0, ${this.options.headerHeight + 2})`)

      // this.get('background')
      //   .get('dom')
      //   .querySelectorAll('.grid-row')
      //   .forEach((d: SVGElementX) => {
      //     d.setAttribute('x', -offset.x + '')
      //     d.setAttribute('width', d.getWidth() + offset.x + '')
      //   })

      // this.get('background')
      //   .get('dom')
      //   .querySelectorAll('.row-line')
      //   .forEach((d: SVGElementX) => {
      //     d.setAttribute('x1', -offset.x + '')
      //   })

      this.get('bars').setAttribute(
        'transform',
        `translate(0, ${this.options.headerHeight + this.options.padding})`
      )

      this.get('dom').setAttribute('x', offset.x)
    }
  }

  private setupDates() {
    this.setBoundingDates()
    this.convertDates()
    this.fillDates()
    ;(<string[]>['header', 'background']).forEach((k: string) =>
      this.get(k).set('width', this.getWidth()).set('height', this.getHeight())
    )
  }

  private fillDates() {
    const dates: dayjs.Dayjs[] = []

    let d: dayjs.Dayjs = null
    do {
      if (!d) {
        d = dayjs(this.get('start'))
      } else if (VIEW_MODE.YEAR == this.options.viewMode) {
        d = d.add(1, 'year')
      } else if (VIEW_MODE.MONTH == this.options.viewMode) {
        d = d.add(1, 'month')
      } else {
        d = d.add(this.options.step, 'hour')
      }
      dates.push(d)
    } while (d.isBefore(this.get('end')))

    this.set('dates', dates)
  }

  private convertDates() {
    this.set('start', this.get('start').startOf('day'))
    this.set('end', this.get('end').startOf('day'))

    if ([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY].some((k) => k == this.options.viewMode)) {
      this.set('start', this.get('start').subtract(7, 'day'))
      this.set('end', this.get('end').add(7, 'day'))
    } else if (VIEW_MODE.MONTH == this.options.viewMode) {
      this.set('start', this.get('start').subtract(1, 'year'))
      this.set('end', this.get('end').add(1, 'year'))
    } else if (VIEW_MODE.YEAR == this.options.viewMode) {
      this.set('start', this.get('start').subtract(2, 'year'))
      this.set('end', this.get('end').add(2, 'year'))
    } else {
      this.set('start', this.get('start').subtract(1, 'month'))
      this.set('end', this.get('end').add(1, 'month'))
    }
  }

  private setBoundingDates() {
    this.get('tasks').forEach((task: Task) => {
      if (!this.get('start') || task.get('start').isBefore(this.get('start'))) {
        this.set('start', task.get('start').clone())
      }

      if (!this.get('end') || task.get('end').isAfter(this.get('end'))) {
        this.set('end', task.get('end').clone())
      }
    })
  }

  private getWidth(): number {
    return this.get('dates').length * this.options.columnWidth + this.options.padding
  }

  private getHeight(): number {
    return (
      this.options.headerHeight +
      this.get('tasks')
        .map((t: Task) => t.get('height'))
        .reduce((a: number, b: number) => a + b + this.options.padding) +
      this.options.padding +
      6
    )
  }

  public render(parent: SVGElementX) {
    parent.setAttribute('width', `${this.getWidth()}`)
    parent.setAttribute('height', `${this.getHeight()}`)

    this.drawBody(parent, this.options.padding * this.get('columns').length)
    this.drawColumns(parent)
  }

  private attachEvents(dom: SVGElementX) {
    if (window.PointerEvent) {
      dom.addEventListener('pointerdown', this.onPointerDown.bind(this)) // Pointer is pressed
      dom.addEventListener('pointerup', this.onPointerUp.bind(this)) // Releasing the pointer
      dom.addEventListener('pointerleave', this.onPointerUp.bind(this)) // Pointer gets out of the dom area
      dom.addEventListener('pointermove', this.onPointerMove.bind(this)) // Pointer is moving
    } else {
      // Add all mouse events listeners fallback
      dom.addEventListener('mousedown', this.onPointerDown.bind(this)) // Pressing the mouse
      dom.addEventListener('mouseup', this.onPointerUp.bind(this)) // Releasing the mouse
      dom.addEventListener('mouseleave', this.onPointerUp.bind(this)) // Mouse gets out of the dom area
      dom.addEventListener('mousemove', this.onPointerMove.bind(this)) // Mouse is moving

      // Add all touch events listeners fallback
      dom.addEventListener('touchstart', this.onPointerDown.bind(this)) // Finger is touching the screen
      dom.addEventListener('touchend', this.onPointerUp.bind(this)) // Finger is no longer touching the screen
      dom.addEventListener('touchmove', this.onPointerMove.bind(this)) // Finger is moving
    }
  }

  private drawBody(parent: SVGElementX, width: number) {
    this.set(
      'dom',
      svg('svg', {
        viewBox: `0 0 ${this.getWidth()} ${this.getHeight()}`,
        y: 0,
        x: 0,
        append_to: parent
      })
    )

    const dom = this.get('dom')
    this.attachEvents(dom)

    this.set(
      'bars',
      svg('g', {
        class: 'bar',
        prepend_to: dom
      })
    )

    const offset: Offset = {
      x: width,
      y: 0
    }

    this.get('background').render(dom, offset, this.get('dates'), this.get('tasks'))
    this.get('header').render(dom, offset, this.get('dates'))

    offset.y = 0
    this.get('tasks').forEach((t: Task) => {
      t.render(this.get('bars'), this.get('start'), offset)
      offset.y += t.get('height') + this.options.padding
    })
  }

  private drawColumns(parent: SVGElementX) {
    const layer = svg('g', {
      class: 'columns',
      append_to: parent
    })

    const columnsLayer = svg('g', { append_to: layer })

    const offset: Offset = { x: this.options.padding, y: 0 }

    this.get('columns').forEach((col: Column) => {
      col.render(columnsLayer, offset)
    })
  }

  getPointFromEvent(event) {
    var point = { x: 0, y: 0 }
    // If even is triggered by a touch event, we get the position of the first finger
    if (event.targetTouches) {
      point.x = event.targetTouches[0].clientX
      point.y = event.targetTouches[0].clientY
    } else {
      point.x = event.clientX
      point.y = event.clientY
    }

    return point
  }

  private onPointerDown(event: Event) {
    this.isPointerDown = true // We set the pointer as down
    // We get the pointer position on click/touchdown so we can get the value once the user starts to drag
    var pointerPosition = this.getPointFromEvent(event)
    this.pointerOrigin.x = pointerPosition.x
    this.pointerOrigin.y = pointerPosition.y
  }

  // We save the original values from the viewBox

  // Function called by the event listeners when user start moving/dragging
  private onPointerMove(event: Event) {
    // Only run this function if the pointer is down
    if (!this.isPointerDown) {
      return
    }
    // This prevent user to do a selection on the page
    event.preventDefault()

    const dom = this.get('dom')
    const viewBox = dom.viewBox.baseVal

    // Get the pointer position as an dom Point
    const pointerPosition = this.getPointFromEvent(event)
    this.viewBox.x = viewBox.x - (pointerPosition.x - this.pointerOrigin.x)
    this.viewBox.y = viewBox.y

    this.pointerOrigin = pointerPosition

    var viewBoxString = `${this.viewBox.x} ${this.viewBox.y} ${viewBox.width} ${viewBox.height}`
    // We apply the new viewBox values onto the SVG
    dom.setAttribute('viewBox', viewBoxString)
  }

  private onPointerUp() {
    // The pointer is no longer considered as down
    this.isPointerDown = false
  }
}
