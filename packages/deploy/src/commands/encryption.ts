import { TaskRegister } from "../../types";
import { output, checkDeployConfigExists, aesCrypto } from "~/utils";
import { deployConfigPath } from "~/config";

const inquirer = require("inquirer");
const dedent = require("dedent");

const register: TaskRegister = {
  name: "encryption",
  description: "生成密文",
  options: {},
  examples: dedent``,
  async register() {
    if (checkDeployConfigExists()) {
      const { content } = await inquirer.prompt([
        {
          type: "input",
          name: "content",
          message: "需要加密的字符"
        }
      ]);
      const { cryptoKey, cryptoIv } = require(deployConfigPath);
      output.success(aesCrypto.encrypt(content, cryptoKey, cryptoIv));
    }
  }
};
export default register;
