var tasks = [
  {
    plan: {
      start: '2020-05-19T05:00:00.000Z',
      end: '2020-05-26T05:00:00.000Z',
      progress: 18,
      height: 22
    },
    name: 'Redesign website',
    id: 'Task 0',
    milestones: [
      {
        date: '2020-08-19T05:00:00.000Z',
        href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png'
      }
    ]
  },
  {
    plans: [
      [
        {
          start: '2020-05-20T05:00:00.000Z',
          end: '2020-05-23T05:00:00.000Z',
          progress: 10,
          height: 50
        },
        {
          start: '2020-05-15T05:00:00.000Z',
          end: '2020-05-18T05:00:00.000Z',
          height: 20
        }
      ],
      [
        {
          start: '2020-05-15T05:00:00.000Z',
          end: '2020-05-18T05:00:00.000Z',
          height: 30
        }
      ]
    ],
    name: 'Write new content',
    id: 'Task 1',
    milestones: [
      [
        {
          date: '2020-08-17T05:00:00.000Z',
          href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png'
        }
      ]
    ]
  },
  {
    plan: {
      start: '2020-05-22T05:00:00.000Z',
      end: '2020-05-25T05:00:00.000Z',
      progress: 87,
      height: 10
    },
    name: 'Apply new styles',
    id: 'Task 2',
    milestones: [
      {
        date: '2020-05-23T05:00:00.000Z',
        href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png'
      }
    ]
  },
  {
    plan: {
      start: '2020-05-26T05:00:00.000Z',
      end: '2020-05-26T05:00:00.000Z',
      progress: 6,
      height: 40
    },
    name: 'Review',
    id: 'Task 3',
    milestones: [
      {
        date: '2020-07-27T05:00:00.000Z',
        href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png'
      }
    ]
  },
  {
    plan: {
      start: '2020-05-27T05:00:00.000Z',
      end: '2020-05-28T05:00:00.000Z',
      progress: 17,
      height: 30
    },
    name: 'Deploy',
    id: 'Task 4',
    milestones: [
      {
        date: '2020-07-28T05:00:00.000Z',
        href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png'
      }
    ]
  },
  {
    plan: {
      start: '2020-05-29T05:00:00.000Z',
      end: '2020-05-29T05:00:00.000Z',
      progress: 42,
      height: 29
    },
    name: 'Go Live!',
    id: 'Task 5',
    milestones: [
      {
        date: '2020-05-25T05:00:00.000Z',
        href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png'
      }
    ]
  }
]

var gantt_chart = new Timeline('#abc123', tasks, {
  columns: [
    { text: 'Name', field: 'name' },
    { text: 'Id', field: 'id' }
  ]
})
// document.querySelector(".gantt-container").scrollLeft = 2045;
