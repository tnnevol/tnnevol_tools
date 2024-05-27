#!/usr/bin/env node

const { cli, help } = require("tasksfile");
const init = require("../lib/commands/init");
const encryption = require("../lib/commands/encryption");
const publish = require("../lib/commands/publish");

/**
 * 任务执行器
 * @param {TaskRegister[]} tasks
 */
function registerTask(tasks) {
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
    }, {})
  );
}

registerTask([init, encryption, publish]);
