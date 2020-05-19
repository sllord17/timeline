var names = [
  ['Redesign website', [0, 7], 22],
  ['Write new content', [1, 4], 50],
  ['Apply new styles', [3, 6], 10],
  ['Review', [7, 7], 40],
  ['Deploy', [8, 9], 30],
  ['Go Live!', [10, 10], 29]
]

var tasks = names.map(function (name, i) {
  var today = new Date()
  var start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  var end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  start.setDate(today.getDate() + name[1][0])
  end.setDate(today.getDate() + name[1][1])

  var milestone = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  milestone.setDate(today.getDate() + parseInt(Math.random() * 100, 10))
  return {
    start: start,
    end: end,
    name: name[0],
    height: name[2],
    id: 'Task ' + i,
    milestones: [
      { date: milestone, href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png' }
    ],
    progress: parseInt(Math.random() * 100, 10)
  }
})

var gantt_chart = new Timeline('#abc123', tasks)
// document.querySelector(".gantt-container").scrollLeft = 2045;
