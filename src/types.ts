import Milestone from './task/Milestone'
import Plan from './task/Plan'
import Task from './task/Task'

export class SVGElementX extends SVGElement {
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

  public applyStyle(obj: any) {
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
