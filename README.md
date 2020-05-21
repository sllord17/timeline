# Timeline

## An open-source timeline view of schedules/itineraries based on [frappe gantt](https://frappe.github.io/gantt)

#### Note: anything about this library is subject to change as it is in development

This project is built with TypeScript for ease of development and is transpiled to support IE11.

Timeline aims to be data driven with little intervention from developers.

Date parsing is powered by a tiny library [dayjs](https://github.com/iamkun/dayjs)

# Using

1. Create a `div` to target

```html
<div class="gantt-container" id="abc123" pointer-events="auto"></div>
```

2. Create your data and timeline configuration

```js
// Plans and milestones are multi-dimensional arrays to support multiple bars within a task view
var tasks = [
  [
    {
      name: 'Task 1',
      plans: [
        [
          {
            start: '2012-05-22',
            end: '2012-06-25'
          }
        ]
      ],
      milestones: []
    }
  ]
]

var timelineOptions = {
  headerHeight: 50,
  columnWidth: 30,
  step: 24,
  barHeight: 20,
  padding: 18,
  viewMode: 'Day'
}
```

3. Pass your css selector to identify your div and options to a timeline object

```js
var timeline = new Timeline('#abc123', tasks)

or

var timeline = new Timeline('#abc123', tasks, timelineOptions)
```

#### See the [example](https://github.com/raiyni/timeline/tree/master/examples) for more thourough usage

Additional config options can be seen within each class.

# Contributing

1. Clone this repo.
2. `cd` into project directory
3. `yarn`
4. `yarn run dev`

License: MIT

---

Project maintained by [Ron Young](https://github.com/raiyni)
