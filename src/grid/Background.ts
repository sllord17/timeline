import { Offset, SVGElementX, VIEW_MODE } from '../types'

import Prop from '../prop'
import Task from '../task/Task'
import { ViewOptions } from '../options'
import dayjs from 'dayjs'
import { svg } from '../util'

export default class Background extends Prop {
  private options: ViewOptions
  private isPointerDown: boolean = false
  private pointerOrigin: any = {
    x: 0,
    y: 0
  }
  private newViewBox: any = { x: 0, y: 0 }

  constructor(options: ViewOptions) {
    super({
      width: 0,
      height: 0
    })
    this.options = options
  }

  public render(layer: SVGElementX, offset: Offset, dates: dayjs.Dayjs[], tasks: Task[]) {
    this.set(
      'dom',
      svg('svg', {
        class: 'grid',
        prepend_to: layer
      })
    )

    let dom = this.get('dom')
    // If browser supports pointer events
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

    this.drawBackground(offset)
    this.drawRows(offset, tasks)
    this.drawTicks(offset, dates)
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

    console.log(event)
    const dom = this.get('dom')
    const viewBox = dom.viewBox.baseVal

    // Get the pointer position as an dom Point
    const pointerPosition = this.getPointFromEvent(event)
    this.newViewBox.x = viewBox.x - (pointerPosition.x - this.pointerOrigin.x)
    this.newViewBox.y = viewBox.y - (pointerPosition.y - this.pointerOrigin.y)

    this.pointerOrigin = pointerPosition

    var viewBoxString = `${this.newViewBox.x} ${this.newViewBox.y} ${viewBox.width} ${viewBox.height}`
    // We apply the new viewBox values onto the SVG
    dom.setAttribute('viewBox', viewBoxString)
  }

  private onPointerUp() {
    // The pointer is no longer considered as down
    this.isPointerDown = false
  }

  private drawBackground(offset: Offset) {
    svg('rect', {
      x: 0,
      y: 0,
      width: this.get('width') + offset.x,
      height: this.get('height'),
      class: 'grid-background',
      append_to: this.get('dom')
    })
  }

  private drawRows(offset: Offset, tasks: Task[]) {
    const rowsLayer = svg('g', { append_to: this.get('dom') })
    const linesLayer = svg('g', { append_to: this.get('dom') })

    const rowWidth = this.get('width') + offset.x
    let y = this.options.padding / 2

    tasks.forEach((task) => {
      const rowHeight = task.get('height') + this.options.padding

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

  private drawTicks(offset: Offset, dates: dayjs.Dayjs[]) {
    let x = offset.x
    const y = this.options.padding / 2,
      height = this.get('height')

    for (const date of dates) {
      let clazz = 'tick'

      if (
        (VIEW_MODE.DAY == this.options.viewMode && date.date() == 1) ||
        (VIEW_MODE.WEEK == this.options.viewMode && date.date() >= 1 && date.date() < 8) ||
        (VIEW_MODE.MONTH == this.options.viewMode && (date.month() + 1) % 3 === 0)
      ) {
        clazz += ' thick'
      }

      svg('path', {
        d: `M ${x} 0 v ${height}`,
        class: clazz,
        append_to: this.get('dom')
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
      const x =
        (dayjs().diff(this.get('start'), 'hour') / this.options.step) * this.options.columnWidth

      svg('rect', {
        x: x + offset.x,
        y: 0,
        width: this.options.columnWidth,
        height: this.get('height'),
        class: 'today-highlight',
        append_to: layer
      })
    }
  }
}
