import { Offset, SVGElementX, VIEW_MODE } from '../types'

import Prop from '../prop'
import Task from '../task/Task'
import { ViewOptions } from '../options'
import dayjs from 'dayjs'
import { svg } from '../util'

export default class Background extends Prop {
  private options: ViewOptions

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
      svg('g', {
        class: 'grid',
        prepend_to: layer
      })
    )

    this.drawBackground(offset)
    this.drawRows(offset, tasks)
    this.drawTicks(offset, dates)
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
