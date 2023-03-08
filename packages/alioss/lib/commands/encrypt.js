(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('path')) :
    typeof define === 'function' && define.amd ? define(['path'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.path));
})(this, (function (path) { 'use strict';

    const { AES_encrypt } = require("../utils/aes.crypto");
    const command = {
        description: "alioss 加密",
        async apply() {
            const configPath = path.resolve(process.cwd(), "alioss.config.js");
            const config = require(configPath);
            const inquirer = require("inquirer");
            const { content } = await inquirer.prompt([
                {
                    type: "input",
                    name: "content",
                    message: "请输入需要加密的字符"
                }
            ]);
            console.log("已加密：", AES_encrypt(content, config.key, config.iv));
        }
    };
    module.exports = command;

}));
