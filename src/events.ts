export enum EVENT {
  SHOW_POPUP = 'SHOW_POPUP',
  HIDE_POPUP = 'HIDE_POPUP',
  TOGGLE_POPUP = 'TOGGLE_POPUP',
  AFTER_RENDER = 'AFTER_RENDER'
}

export interface Consumer {
  eventHandler(event: EVENT): void
}
