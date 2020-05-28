import Milestone from './task/Milestone'
import Plan from './task/Plan'
import Prop from './prop'
import { SVGElementX } from './types'
import Task from './task/Task'
import { ViewOptions } from './options'
import { toDom } from './util'

export interface PopupOptions {
  position?: string
  title?: string
  subtitle?: string
  positionTarget: SVGElementX
  eventTarget: Plan | Milestone | Task
}

export default class Popup extends Prop {
  private options: ViewOptions

  constructor(options: ViewOptions, parent: HTMLDivElement) {
    super({
      parent: parent,
      title: toDom('<div class="title"></div>'),
      subtitle: toDom('<div class="subtitle"></div>'),
      pointer: toDom('<div class="pointer"></div>')
    })

    this.options = options

    parent.appendChild(this.get('title'))
    parent.appendChild(this.get('subtitle'))
    parent.appendChild(this.get('pointer'))
  }

  public show(config: PopupOptions): void {
    if (!config.positionTarget) throw new Error('target is required to show popup')

    const parent = this.get('parent')
    parent.style.display = 'block'

    if (!config.position) {
      config.position = 'left'
    }

    if (this.options.popupProducer) {
      parent.innerHTML = this.options.popupProducer(config.eventTarget)
      this.set('pointer', toDom('<div class="pointer"></div>'))
      parent.appendChild(this.get('poiner'))
    } else {
      this.get('title').innerHTML = config.title
      this.get('subtitle').innerHTML = config.subtitle
      parent.style.width = parent.clientWidth + 'px'
    }

    const ctm = config.positionTarget.getCTM()
    const pos = config.positionTarget.getBBox()
    console.log(config.positionTarget)
    if (config.position == 'left') {
      parent.style.left = ctm.e + pos.x + (pos.width + 10) + 'px'
      parent.style.top = ctm.f + pos.y + 'px'

      this.get('pointer').style.transform = 'rotateZ(90deg)'
      this.get('pointer').style.left = '-7px'
      this.get('pointer').style.top = '2px'
    }
  }

  public hide(): void {
    this.get('parent').style.display = 'none'
  }

  public isVisible(): boolean {
    return this.get('parent').style.display == 'none'
  }
}
