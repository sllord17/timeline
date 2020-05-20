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
}

export interface ImageOptions {
  width: number
  height: number
  href: string
}
