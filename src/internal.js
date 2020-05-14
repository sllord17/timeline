export default class Internal {
  constructor(gantt) {
    this.gantt = gantt
  }

  getOption(key) {
    return this.gantt.options[key]
  }

  getLayer(key) {
    return this.gantt.layers[key]
  }

  getTasks() {
    return this.gantt.tasks
  }

  getTaskIdx(i) {
    const tasks = this.getTasks().entries()
    return i < tasks.length ? tasks[i] : null
  }
}
