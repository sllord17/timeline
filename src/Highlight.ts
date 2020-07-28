import Prop from './prop'
import { ViewOptions } from './options';
import { svg } from './util';
import { SVGElementX, Offset, VIEW_MODE } from './types';
import dayjs from 'dayjs';
import { EVENT, Consumer } from './events';

export interface HighlightOptions {
  color: string
  startDate: string
  endDate: string
  x?: number
  y?: number
}

function generate_id(highlight: Highlight) {
  return 'highlight_' + Math.random().toString(36).slice(2, 12)
}

export default class Highlight extends Prop implements Consumer {
  private options: ViewOptions

  constructor(options: ViewOptions, parent: HTMLDivElement, config: HighlightOptions) {
    super({
      parent: parent,
      width: 0,
      height: 0,
      y: 0,
      x: 0
    })

    this.options = options
    this.properties = {
      ...config,
      height: 0,
      id: generate_id(this),
      type: 'Highlight'
    }
    this.set('startDate', dayjs(config.startDate))
    this.set('endDate', dayjs(config.endDate))
    this.set('duration', this.get('endDate').diff(this.get('startDate'), 'hour'))
  }

  eventHandler(event: EVENT): void {
      if (event == EVENT.SETUP_HIGHLIGHTS) {
        console.log(this)
      }
  }

  public render(layer: SVGElementX, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, offset: Offset) {

    console.log(this.options)
    console.log(this.computeX(startDate))
    this.set('x', this.computeX(startDate))

    this.set(
      'dom',
      svg('g', {
        class: 'highlight',
        'data-id': this.get('id'),
        append_to: layer
      })
    )

    const rect = svg('rect', {
      x: this.get('x'),
      y: this.get('y') + offset.y,
      width: this.get('duration') * this.options.columnWidth,
      height: this.options.gridHeight,
      //rx: this.get('cornerRadius'),
      //ry: this.get('cornerRadius'),
      class: 'bar',
      append_to: layer
    })

  /*  this.set(
      'bar',
      svg('rect', {
        x: this.get('x'),
        y: this.get('y') + offset.y,
        width: this.get('duration') * this.options.columnWidth,
        height: this.options.gridHeight,
        //rx: this.get('cornerRadius'),
        //ry: this.get('cornerRadius'),
        //class: 'bar',
        append_to: layer
      })
    )*/

    if (this.get('highlightStyle')) {
      const style = this.get('highlightStyle')
      rect.applyStyle(style)
    }
    //console.log(startDate)
    //console.log(offset)
    //const dom = this.options.parent.querySelector('.highlight-wrapper > svg')
    //const obj = svg('g', {
    //  class: 'highlight',
    //  prepend_to: dom
    //})

    //this.drawBackground(layer)
  }

  private computeX(startDate: dayjs.Dayjs): number {
    console.log(this.options.viewMode + '\n' + this.options.columnWidth + '\n' + this.options.step)
    if (VIEW_MODE.MONTH == this.options.viewMode) {
      return (this.get('startDate').diff(startDate, 'day') * this.options.columnWidth) / 30
    }

    return (
      (this.get('startDate').diff(startDate, 'hour') / this.options.step) * this.options.columnWidth
    )
  }
}
