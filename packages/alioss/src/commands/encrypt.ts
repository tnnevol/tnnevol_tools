import { ActionCommand, AesCrypto, AliossConfig } from "~types/index";
import path from "path";

const { AES_encrypt }: AesCrypto.AesCrypto = require("../utils/aes.crypto");

const command: ActionCommand = {
  description: "alioss 加密",
  async apply() {
    const configPath = path.resolve(process.cwd(), "alioss.config.js");
    const config: AliossConfig = require(configPath);
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
