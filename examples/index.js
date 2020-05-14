var names = [
    ["Redesign website", [0, 7]],
    ["Write new content", [1, 4]],
    ["Apply new styles", [3, 6]],
    ["Review", [7, 7]],
    ["Deploy", [8, 9]],
    ["Go Live!", [10, 10]]
];

var tasks = names.map(function(name, i) {
    var today = new Date();
    var start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    start.setDate(today.getDate() + name[1][0]);
    end.setDate(today.getDate() + name[1][1]);

    var milestone = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    milestone.setDate(today.getDate() + parseInt(Math.random() * 100, 10));
    return {
        start: start,
        end: end,
        name: name[0],
        id: "Task " + i,
        milestones: [{date: milestone, href: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png' }],
        progress: parseInt(Math.random() * 100, 10)
    }
});
tasks[1].dependencies = "Task 0"
tasks[2].dependencies = "Task 1"
tasks[3].dependencies = "Task 2"
tasks[5].dependencies = "Task 4"

var gantt_chart = new Gantt("#gantt-1", tasks);
// document.querySelector(".gantt-container").scrollLeft = 2045;

