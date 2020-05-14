import Task from './task'

export default class Tasks {
  constructor(gantt, tasks) {
    this.gantt = gantt
    this.tasks = tasks.map((t) => new Task(gantt, t))
  }

  getBoundingDates() {
    let gantt_start = null,
      gantt_end = null

    for (const task of this.tasks) {
      // set global start and end date
      if (!gantt_start || task.start < gantt_start) {
        gantt_start = task.start
      }
      if (!gantt_end || task.end > gantt_end) {
        gantt_end = task.end
      }

      // if (task.milestones) {
      //   for (const milestone of task.milestones) {
      //     if (milestone.date < this.gantt_start) {
      //       gantt_start = milestone.date
      //     }

      //     if (milestone.date > this.gantt_end) {
      //       gantt_end = milestone.date
      //     }
      //   }
      // }
    }

    return { gantt_start, gantt_end }
  }

  render() {
    this.tasks.forEach((t) => t.render())
  }

  getHeight() {
    let sum = this.gantt.options.padding * this.tasks.length
    for (const task of this.tasks) {
      sum += task.height
    }

    return sum
  }
}
