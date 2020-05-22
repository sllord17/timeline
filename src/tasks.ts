import Task, { TaskOptions } from './task'

import { ViewOptions } from './view'

export default class Tasks {
  private options: ViewOptions
  private _tasks: Task[]

  constructor(options: ViewOptions, config: TaskOptions[]) {
    this.options = options

    this._tasks = config.map((c) => new Task(options, c))
  }

  public forEach(callable: (task: Task, idx: number) => void) {
    this._tasks.forEach(callable)
  }

  public getHeight(): number {
    return this._tasks.map((t) => t.get('height')).reduce((a, b) => a + b + this.options.padding)
  }
}
