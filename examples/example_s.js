var tasks = [
  {
    plans: [
      [
        {
          start: '2020-02-10T05:00:00.000Z',
          end: '2020-02-25T05:00:00.000Z',
          progress: 100,
          height: 20,
          label: 'S - B',
          progressStyle: {
            fill: '#f2c329'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          },
          name: 'Test 20 - 123 (Alpha)',
          tooltip: 'Date1 <b>12-Dec-2019</b><br>' +
          'Date2:'
        },
        {
          start:'2020-02-01T05:00:00.000Z',
          end:'2020-02-10T05:00:00.000Z',
          progress: 100,
          height: 5,
          progressStyle: {
            fill: '#f2c329'
          },
          stretch: true,
          stretchHeight: 30
        },
        {
          start:'2020-02-26T05:00:00.000Z',
          end:'2020-03-10T05:00:00.000Z',
          progress: 100,
          height: 5,
          progressStyle: {
            fill: '#f2c329'
          },
          stretch: true,
          stretchHeight: 30
        }
      ],
      [
        {
          start: '2020-01-30T05:00:00.000Z',
          end: '2020-02-08T05:00:00.000Z',
          progress: 100,
          label: '44 cars',
          progressStyle: {
            fill: '#93D591',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          },
          name: 'Rail',
          tooltip: 'Trains'
        },
        {
          start: '2020-02-12T05:00:00.000Z',
          end: '2020-02-21T05:00:00.000Z',
          progress: 100,
          label: '12 Dep - Arr 21',
          rightLabel: 'K',
          progressStyle: {
            fill: '#97CFDD',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          }
        }
      ],
      [
        {
          start: '2020-01-30T05:00:00.000Z',
          end: '2020-02-06T05:00:00.000Z',
          progress: 100,
          label: '~150',
          progressStyle: {
            fill: '#93D591',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          }
        },
        {
          start: '2020-02-14T05:00:00.000Z',
          end: '2020-02-23T05:00:00.000Z',
          progress: 100,
          label: '14 Dep - Arr 23',
          progressStyle: {
            fill: '#97CFDD',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          }
        }
      ],
      [
        {
          start: '2020-02-16T05:00:00.000Z',
          end: '2020-02-25T05:00:00.000Z',
          progress: 100,
          label: '16 Dep - Arr 25',
          progressStyle: {
            fill: '#97CFDD',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          }
        }
      ]
    ],
    name: [
      {
        label:'FP A 1 (2/3)',
        backgroundStyle: {
          fill: '#f2c329'
        }
      },
      {
        label:'MS'
      }
    ],
    id: 'Task 0',
    pieces: 2314,
    area: '395k',
    status: [
      {
        label: '',
        backgroundShape: 'circle',
        backgroundStyle: {
          fill: '#32CD32',
          stroke: '#228B22'
        }
      },
      {
        label: ''
      }
    ],
    org: [
      {
        label: '',
        backgroundShape: 'img',
        href: 'images/stripes.png',
        backgroundStyle: {
        }
      },
      {
        label: ''
      }
    ],
    milestones: [
      [
        {
          date: '2019-12-12',
          width: 20,
          height: 20,
          href: 'images/blacktri.png',
          name: '12 Dec 2019',
          tooltip: 'valid'
        },
        {
          date: '2019-12-17',
          width: 20,
          height: 20,
          href: 'images/blackrhom.png',
          tooltip: 'cargo',
          name: '17 Dec 2019'
        },
        {
          date: '2020-01-16',
          width: 20,
          height: 20,
          href: 'images/blackcircle.png',
          tooltip: 'target'
        },
        {
          date: '2020-01-21',
          width: 20,
          height: 20,
          href: 'images/blacksquare.png',
          name: '21 Jan 2020',
          tooltip: 'order'
        },
        {
          date: '2020-01-31',
          width: 20,
          height: 20,
          href:
            'images/yellowstar.png',
          name: '31 Jan 2020',
          tooltip: ''
        },
        {
          date: '2020-02-10',
          width: 20,
          height: 20,
          href:
            'images/leftarrow.png',
          name: '10 Feb 2020',
          tooltip: ''
        },
        {
          date:'2020-02-20',
          width: 20,
          height: 20,
          href:
            'images/dottedline.png',
          name: '20 Feb 2020',
          tooltip: ''
        },
        {
          date: '2020-02-26',
          width: 20,
          height: 20,
          href:
            'images/rightarrow.png',
          name: '26 Feb 2020',
          tooltip: ''
        },
        {
          date: '2020-03-11',
          width: 20,
          height: 20,
          href: 'images/greencheck.png',
          name: '11 Mar 2020',
          tooltip: ''
        }
      ],
      [
        {
          date: '2020-01-28',
          width: 20,
          height: 20,
          href: 'images/train.png',
          tooltip: '',
          name: ''
        },
        {
          date: '2020-02-10',
          width: 20,
          height: 20,
          href: 'images/ship.png',
          tooltip: '',
          name: ''
        }
      ],
      [
        {
          date: '2020-01-28',
          width: 20,
          height: 20,
          href: 'images/truck.png',
          tooltip: '',
          name: ''
        },
        {
          date: '2020-02-12',
          width: 20,
          height: 20,
          href: 'images/ship.png',
          tooltip: '',
          name: ''
        }
      ],
      [
        {
          date: '2020-02-14',
          width: 20,
          height: 20,
          href: 'images/ship.png',
          tooltip: '',
          name: ''
        }
      ]
    ]
  },
  {
    plans: [
      [
        {
          start: '2020-02-10T05:00:00.000Z',
          end: '2020-02-25T05:00:00.000Z',
          progress: 100,
          height: 20,
          label: 'PA',
          progressStyle: {
            fill: '#f2c329'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          },
          name: 'Def - (Alpha)',
          tooltip: ''
        },
        {
          start:'2020-02-01T05:00:00.000Z',
          end:'2020-02-10T05:00:00.000Z',
          progress: 100,
          height: 5,
          progressStyle: {
            fill: '#f2c329'
          },
          stretch: true,
          stretchHeight: 30
        },
        {
          start:'2020-02-26T05:00:00.000Z',
          end:'2020-03-10T05:00:00.000Z',
          progress: 100,
          height: 5,
          progressStyle: {
            fill: '#f2c329'
          },
          stretch: true,
          stretchHeight: 30
        }
      ],
      [
        {
          start: '2020-01-30T05:00:00.000Z',
          end: '2020-02-08T05:00:00.000Z',
          progress: 100,
          label: 'x?',
          progressStyle: {
            fill: '#93D591',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          },
          name: 'Rail',
          tooltip: ''
        },
        {
          start: '2020-02-12T05:00:00.000Z',
          end: '2020-02-27T05:00:00.000Z',
          progress: 94,
          label: '12 Dep - Arr 27',
          rightLabel: '',
          progressStyle: {
            fill: '#97CFDD',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          }
        }
      ],
      [
        {
          start: '2020-01-30T05:00:00.000Z',
          end: '2020-02-06T05:00:00.000Z',
          progress: 100,
          label: '~?',
          progressStyle: {
            fill: '#93D591',
            stroke: 'black',
            strokeWidth: '1px'
          },
          labelStyle: {
            fill: 'black',
            fontWeight: 'bold'
          }
        }
      ]
    ],
    name: [
      {
        label:'FP',
        backgroundStyle: {
          fill: '#f2c329'
        }
      },
      {
        label:'MS'
      }
    ],
    id: 'Task 1',
    pieces: 703,
    area: '99k',
    status: [
      {
        label: '',
        backgroundShape: 'circle',
        backgroundStyle: {
          fill: '#32CD32',
          stroke: '#228B22'
        },
        id: 'greencircle'
      },
      {
        label: ''
      }
    ],
    milestones: [
      [
        {
          date: '2019-12-12',
          width: 20,
          height: 20,
          href: 'images/redtri.png',
          name: '12 Dec 2019',
          tooltip: 'late'
        },
        {
          date: '2019-12-14',
          width: 20,
          height: 20,
          href: 'images/redtrifill.png',
          name: '14 Dec 2019',
          tooltip: 'late'
        },
        {
          date: '2019-12-17',
          width: 20,
          height: 20,
          href: 'images/greenrhom.png',
          tooltip: 'target',
          name: '17 Dec 2019'
        },
        {
          date: '2020-01-16',
          width: 20,
          height: 20,
          href: 'images/blackcircle.png',
          tooltip: 'target'
        },
        {
          date: '2020-01-21',
          width: 20,
          height: 20,
          href: 'images/blacksquare.png',
          name: '21 Jan 2020',
          tooltip: 'order'
        },
        {
          date: '2020-01-31',
          width: 20,
          height: 20,
          href:
            'images/yellowstar.png',
          name: '31 Jan 2020',
          tooltip: ''
        },
        {
          date: '2020-02-10',
          width: 20,
          height: 20,
          href:
            'images/leftarrow.png',
          name: '10 Feb 2020',
          tooltip: ''
        },
        {
          date:'2020-02-20',
          width: 20,
          height: 20,
          href:
            'images/dottedline.png',
          name: '20 Feb 2020',
          tooltip: ''
        },
        {
          date: '2020-02-26',
          width: 20,
          height: 20,
          href:
            'images/rightarrow.png',
          name: '26 Feb 2020',
          tooltip: ''
        },
        {
          date: '2020-03-11',
          width: 20,
          height: 20,
          href: 'images/greencheck.png',
          name: '11 Mar 2020',
          tooltip: ''
        }
      ],
      [
        {
          date: '2020-01-28',
          width: 20,
          height: 20,
          href: 'images/train.png',
          tooltip: '',
          name: ''
        },
        {
          date: '2020-02-10',
          width: 20,
          height: 20,
          href: 'images/ship.png',
          tooltip: '',
          name: ''
        }
      ],
      [
        {
          date: '2020-01-28',
          width: 20,
          height: 20,
          href: 'images/truck.png',
          tooltip: '',
          name: ''
        }
      ]
    ]
  }
];

var gantt_chart = new Timeline.View('#timeline', tasks, {
  viewMode: -1,
  columns: [
    { text: '', field: 'status'},
    { text: '', field: 'org'},
    { text: 'Mvmt Name', field: 'name'},
    { text: 'Sq/ft', field: 'area' },
    { text: 'Pcs', field: 'pieces' }
  ]
});
