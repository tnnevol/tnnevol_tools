(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    const fs = require("fs-extra");
    const program = require("commander");
    const packageInfo = require("../package.json");
    module.exports = class Service {
        constructor() {
            setupDefaultCommands();
            registerCommands();
        }
        run(_id, _args, rawArgv) {
            program.parse(rawArgv, { from: "user" });
        }
    };
    // 设置默认命令
    const setupDefaultCommands = () => {
        program.version(packageInfo.version, "-v, --version", "输出当前版本号");
        program.helpOption("-h, --help", "获取帮助");
        program.addHelpCommand(false);
    };
    // 注册命令
    const registerCommands = () => {
        const commandsPath = `${__dirname}/commands`;
        const idToPlugin = (id) => {
            const command = require(`${commandsPath}/${id}`);
            const commandName = id.split(".")[0];
            const alias = id.charAt(0);
            /* const activeFn: ActionFn = options => {
              command.apply(options.mode);
            };
            program
              .command(commandName)
              .description(command.description)
              .alias(alias)
              .option("-m, --mode <mode>", "setup deploy mode")
              .action(activeFn);*/
            program
                .command(commandName)
                .description(command.description)
                .alias(alias)
                .action(() => {
                command.apply();
            });
        };
        fs.readdirSync(`${commandsPath}`).forEach(idToPlugin);
    };

}));
