import Milestone from './milestone'
import Plan from './task/Plan'
import { SVGElementX } from './types'
import Task from './task/Task'
import { ViewOptions } from './view'
import { toDom } from './util'

export interface PopupOptions {
  position?: string
  title?: string
  subtitle?: string
  positionTarget: SVGElementX
  eventTarget: Plan | Milestone | Task
}

export default class Popup {
  private options: ViewOptions
  private parent: HTMLDivElement

  private title: HTMLDivElement
  private subtitle: HTMLDivElement
  private pointer: HTMLDivElement

  constructor(options: ViewOptions, parent: HTMLDivElement) {
    this.options = options
    this.parent = parent

    this.title = (toDom('<div class="title"></div>') as unknown) as HTMLDivElement
    this.subtitle = (toDom('<div class="subtitle"></div>') as unknown) as HTMLDivElement
    this.pointer = (toDom('<div class="pointer"></div>') as unknown) as HTMLDivElement

    parent.appendChild(this.title)
    parent.appendChild(this.subtitle)
    parent.appendChild(this.pointer)
  }

  public show(config: PopupOptions): void {
    if (!config.positionTarget) throw new Error('target is required to show popup')

    this.parent.style.display = 'block'

    if (!config.position) {
      config.position = 'left'
    }

    if (this.options.popupProducer) {
      this.parent.innerHTML = this.options.popupProducer(config.eventTarget)
      this.pointer = (toDom('<div class="pointer"></div>') as unknown) as HTMLDivElement
      this.parent.appendChild(this.pointer)
    } else {
      this.title.innerHTML = config.title
      this.subtitle.innerHTML = config.subtitle
      this.parent.style.width = this.parent.clientWidth + 'px'
    }

    const pos = config.positionTarget.getBBox()
    if (config.position == 'left') {
      this.parent.style.left = pos.x + (pos.width + 10) + 'px'
      this.parent.style.top = pos.y + 'px'

      this.pointer.style.transform = 'rotateZ(90deg)'
      this.pointer.style.left = '-7px'
      this.pointer.style.top = '2px'
    }
  }

  public hide(): void {
    this.parent.style.display = 'none'
  }

  public isVisible(): boolean {
    return this.parent.style.display == 'none'
  }
}
