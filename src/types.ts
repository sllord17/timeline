import Milestone from './task/Milestone'
import Plan from './task/Plan'
import Task from './task/Task'

export class SVGElementX extends SVGElement {
  columnRow: SVGElementX
  public getX(): number {
    return +this.getAttribute('x')
  }

  public getY(): number {
    return +this.getAttribute('y')
  }

  public getWidth(): number {
    return +this.getAttribute('width')
  }

  public getHeight(): number {
    return +this.getAttribute('height')
  }

  public getEndX(): number {
    return this.getX() + this.getWidth()
  }

  public getBBox(): DOMRect {
    return null
  }

  public getCTM(): DOMMatrix {
    return null
  }

  public applyStyle(obj: any) {
    return obj
  }

  public setAttributes(obj: any) {
    return obj
  }
}

export interface ImageOptions {
  width: number
  height: number
  href: string
}

export interface Offset {
  x?: number
  y?: number
}

export interface HtmlProducer {
  (target: Task | Plan | Milestone): string
}

export enum VIEW_MODE {
  QUARTER_DAY = 'Quarter Day',
  HALF_DAY = 'Half Day',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
}
