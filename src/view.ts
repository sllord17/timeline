export enum VIEW_MODE {
  QUARTER_DAY = 'Quarter Day',
  HALF_DAY = 'Half Day',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
}

export const VIEW_MODES = [...Object.keys(VIEW_MODE).map((k) => VIEW_MODE[k] as VIEW_MODE)]

export const viewIs = (contract: VIEW_MODE[], mode: VIEW_MODE) => {
  return contract.some((c) => c == mode)
}
