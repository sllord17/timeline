type obj = { [key: string]: any }

export default class Prop {
  private _properties: obj = {}

  constructor(o: obj = {}) {
    this.properties = o
  }

  get type(): string {
    return this.get('type')
  }

  get properties(): obj {
    return { ...this._properties }
  }

  set properties(o: obj) {
    this._properties = { ...this._properties, ...o }
  }

  set(key: string, value: any): any {
    this._properties[key] = value
    return this
  }

  get(key: string): any {
    return this._properties[key]
  }

  unset(key: string) {
    delete this._properties[key]
  }
}
