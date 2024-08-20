import { cli, help } from "tasksfile";
import path from "path";
import fs from "fs-extra";

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
  params?: string[];
};

/**
 * 任务执行器
 */
export default function registerTask(tasks: TaskRegister[]) {
  const initModule: CommandsModule = {};
  tasks.push(createVersionTask());
  tasks.forEach(task => {
    help(task.register, task.description, {
      options: task.options,
      examples: task.examples,
      params: task.params
    });
  });

  cli({
    ...tasks.reduce((cliOptions, task) => {
      cliOptions[task.name] = task.register;
      return cliOptions;
    }, initModule)
  });
}

// 创建获取版本的任务
function createVersionTask() {
  return {
    name: "version",
    description: "获取版本号",
    register() {
      const { version } = fs.readJSONSync(
        path.join(process.cwd(), "./package.json")
      );
      console.log(version);
    }
  };
}
