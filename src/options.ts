import { Consumer, EVENT } from './events'
import { HtmlProducer, ImageOptions, Offset, VIEW_MODE } from './types'

export interface ViewOptions {
  headerHeight?: number
  columnWidth?: number
  step?: number
  barHeight?: number
  padding?: number
  viewMode?: VIEW_MODE
  dateFormat?: string
  draggable: boolean
  popup?: true
  popupProducer?: HtmlProducer
  dispatch?: { (key: EVENT, paylod?: any): void }
  subscribe?: { (key: EVENT, clazz: Consumer): void }
  unsubscribe?: { (key: EVENT, clazz: Consumer): void }
  columns: ColumnOptions[]
  parent: HTMLDivElement
}

export interface SingleBarOptions extends TaskBaseOptions {
  plan: PlanOptions
  milestones?: MilestoneOptions[]
}

export interface MultiBarOptions extends TaskBaseOptions {
  plans: PlanOptions[][]
  milestones?: MilestoneOptions[][]
}

interface TaskBaseOptions {
  id: string
}

export type TaskOptions = SingleBarOptions & MultiBarOptions

interface BasePlanOptions {
  progress?: number
  height?: number
  start: string
  end: string
  label: string
  cornerRadius?: number
  progressStyle?: ElementCSSInlineStyle
  backgroundStyle?: ElementCSSInlineStyle
  labelStyle?: ElementCSSInlineStyle
}

export type PlanOptions = BasePlanOptions & Offset

interface MilestoneBaseOptions {
  date: string
}

export type MilestoneOptions = MilestoneBaseOptions & ImageOptions & Offset

export interface ColumnOptions {
  id: string
  text: string
  field: string
  customClass?: string
}
