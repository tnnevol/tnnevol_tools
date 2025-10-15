import { output, checkDeployConfigExists, aesCrypto } from "../utils";
import { deployConfigPath } from "../config";
import inquirer from "inquirer";
import dedent from "dedent";

const register: TaskRegister = {
  name: "encryption",
  description: "生成密文",
  options: {},
  examples: dedent``,
  async register() {
    const { ext, has } = checkDeployConfigExists();
    if (has) {
      const { content } = await inquirer.prompt([
        {
          type: "input",
          name: "content",
          message: "需要加密的字符"
        }
      ]);
      const { cryptoKey, cryptoIv } = (
        await import(`${deployConfigPath}.${ext}`)
      ).default;
      output.success(aesCrypto.encrypt(content, cryptoKey, cryptoIv));
    }
  }
};
export default register;
