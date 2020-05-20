import { SVGElementX } from './types'

export const svg = (tag: string, attrs: any): SVGElementX => {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElementX

  for (const attr in attrs) {
    if (attr === 'append_to') {
      const parent = attrs.append_to
      parent.appendChild(elem)
    } else if (attr === 'prepend_to') {
      const parent = attrs.prepend_to
      parent.prepend(elem)
    } else if (attr === 'innerHTML') {
      elem.innerHTML = attrs.innerHTML
    } else {
      elem.setAttribute(attr, attrs[attr])
    }
  }

  return elem
}

export const toTextFragment = (text: string): DocumentFragment => {
  const frag = document.createDocumentFragment(),
    temp = document.createElement('div')

  temp.innerHTML = text
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild)
  }
  return frag
}

export const toDom = (html: string): Node => {
  const frag = document.createRange().createContextualFragment(html)
  return frag.firstChild
}

export const delegate = (
  element: SVGElementX,
  event: string,
  selector: string,
  listener: { (event: Event, target: HTMLElement | SVGElementX): void }
) => {
  element.addEventListener(event, function (e) {
    const delegatedTarget = (e.target as SVGElementX).closest(selector)
    if (delegatedTarget) {
      const delegateEvent = { ...e, target: delegatedTarget }
      listener.call(this, delegateEvent)
    }
  })
}
