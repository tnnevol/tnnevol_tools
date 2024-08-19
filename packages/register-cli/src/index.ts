import { cli, help } from "tasksfile";

export interface ICLIOptions {
  [key: string]: number | string | boolean;
}

export type CommandFunction = (options: ICLIOptions, ...args: any[]) => any;

export interface ICommandsDictionary {
  [namespace: string]: CommandsModule;
}
export type CommandsModule = ICommandsDictionary | CommandFunction;

export type TaskRegister = {
  name: string;
  description: string;
  register: CommandFunction;
  options?: {
    [key: string]: string;
  };
  examples?: string;
};

/**
 * 任务执行器
 */
export default function registerTask(tasks: TaskRegister[]) {
  const initModule: CommandsModule = {};
  tasks.forEach(task => {
    help(task.register, task.description, {
      options: task.options,
      examples: task.examples
    });
  });

  cli(
    tasks.reduce((cliOptions, task) => {
      cliOptions[task.name] = task.register;
      return cliOptions;
    }, initModule)
  );
}
