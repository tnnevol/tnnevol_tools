import path from "path";
import aesCrypto from "../utils/aes.crypto";
import { readAliossConfig } from "../utils/common";
import inquirer from "inquirer";
import type { TaskRegister } from "@tnnevol/register-cli";

const register: TaskRegister = {
  name: "encrypt",
  description: "alioss 加密",
  options: {},
  async register() {
    const configPath = path.resolve(process.cwd(), "alioss.config.js");
    const config = await readAliossConfig(configPath);
    const { content } = await inquirer.prompt([
      {
        type: "input",
        name: "content",
        message: "请输入需要加密的字符"
      }
    ]);
    console.log(
      "已加密：",
      aesCrypto.AES_encrypt(content, config.key, config.iv)
    );
  }
};

export default register;
