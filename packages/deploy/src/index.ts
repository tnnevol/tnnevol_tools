import type { TaskRegister, CommandFunction } from "../types";
import { cli, help } from "tasksfile";
import init from "~/commands/init";
import encryption from "~/commands/encryption";
import publish from "~/commands/publish";

// 任务执行器

function registerTask(tasks: TaskRegister[]) {
  tasks.forEach(task => {
    help(task.register, task.description, {
      options: task.options,
      examples: task.examples
    });
  });

  cli(
    tasks.reduce((cliOptions: { [key: string]: CommandFunction }, task) => {
      cliOptions[task.name] = task.register;
      return cliOptions;
    }, {})
  );
}

registerTask([init, encryption, publish]);
