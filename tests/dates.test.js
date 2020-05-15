import dates from '../src/dates'

test('Parse: parses string date', () => {
  const date = dates.parse('2017-09-09')

  expect(date.getDate()).toBe(9)
  expect(date.getMonth()).toBe(8)
  expect(date.getFullYear()).toBe(2017)
})

test('Parse: parses string datetime', () => {
  const date = dates.parse('2017-08-27 16:08:34')

  expect(date.getFullYear()).toBe(2017)
  expect(date.getMonth()).toBe(7)
  expect(date.getDate()).toBe(27)
  expect(date.getHours()).toBe(16)
  expect(date.getMinutes()).toBe(8)
  expect(date.getSeconds()).toBe(34)
})

test('Parse: parses string datetime', () => {
  const date = dates.parse('2016-02-29 16:08:34.3')

  expect(date.getFullYear()).toBe(2016)
  expect(date.getMonth()).toBe(1)
  expect(date.getDate()).toBe(29)
  expect(date.getHours()).toBe(16)
  expect(date.getMinutes()).toBe(8)
  expect(date.getSeconds()).toBe(34)
  expect(date.getMilliseconds()).toBe(300)
})

test('Parse: parses string datetime', () => {
  const date = dates.parse('2015-07-01 00:00:59.200')

  expect(date.getFullYear()).toBe(2015)
  expect(date.getMonth()).toBe(6)
  expect(date.getDate()).toBe(1)
  expect(date.getHours()).toBe(0)
  expect(date.getMinutes()).toBe(0)
  expect(date.getSeconds()).toBe(59)
  expect(date.getMilliseconds()).toBe(200)
})

test('Format: converts date object to string', () => {
  const date = new Date('2017-09-18')
  expect(dates.to_string(date)).toBe('2017-09-18')
})

test('Format: converts date object to string', () => {
  const date = new Date('2016-02-29 16:08:34.3')
  expect(dates.to_string(date, true)).toBe('2016-02-29 16:08:34.300')
})

test('Format: converts date object to string', () => {
  const date = new Date('2016-02-29 16:08:34.3')
  expect(dates.to_string(date, true)).toBe('2016-02-29 16:08:34.300')
})

test('Parse: returns Date Object as is', () => {
  const d = new Date()
  const date = dates.parse(d)

  expect(d).toBe(date)
})

test('Diff: returns diff between 2 date objects', () => {
  const a = dates.parse('2017-09-08')
  const b = dates.parse('2017-06-07')

  expect(dates.diff(a, b, 'day')).toBe(93)
  expect(dates.diff(a, b, 'month')).toBe(3)
  expect(dates.diff(a, b, 'year')).toBe(0)
})

test('StartOf', () => {
  const date = dates.parse('2017-08-12 15:07:34.012')

  const start_of_millisecond = dates.start_of(date, 'millisecond')
  expect(dates.to_string(start_of_millisecond, true)).toBe('2017-08-12 15:07:34.012')

  const start_of_second = dates.start_of(date, 'second')
  expect(dates.to_string(start_of_second, true)).toBe('2017-08-12 15:07:34.000')

  const start_of_minute = dates.start_of(date, 'minute')
  expect(dates.to_string(start_of_minute, true)).toBe('2017-08-12 15:07:00.000')

  const start_of_hour = dates.start_of(date, 'hour')
  expect(dates.to_string(start_of_hour, true)).toBe('2017-08-12 15:00:00.000')

  const start_of_day = dates.start_of(date, 'day')
  expect(dates.to_string(start_of_day, true)).toBe('2017-08-12 00:00:00.000')

  const start_of_month = dates.start_of(date, 'month')
  expect(dates.to_string(start_of_month, true)).toBe('2017-08-01 00:00:00.000')

  const start_of_year = dates.start_of(date, 'year')
  expect(dates.to_string(start_of_year, true)).toBe('2017-01-01 00:00:00.000')
})

test('format', () => {
  const date = dates.parse('2017-08-12 15:07:23')
  expect(dates.format(date, 'YYYY-MM-DD')).toBe('2017-08-12')
})

test('format', () => {
  const date = dates.parse('2016-02-29 16:08:34.3')
  expect(dates.format(date)).toBe('2016-02-29 16:08:34.300')
})
