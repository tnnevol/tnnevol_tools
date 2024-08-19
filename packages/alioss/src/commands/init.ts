import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import inquirer from "inquirer";
import createUid from "../utils/create.uid";
import aesCrypto from "../utils/aes.crypto";
import type { TaskRegister } from "@tnnevol/register-cli";

const register: TaskRegister = {
  name: "init",
  options: {},
  description: "alioss 初始化",
  async register() {
    const configPath = path.resolve(process.cwd(), "alioss.config.js");
    const ignoreFile = path.resolve(process.cwd(), ".ossignore");
    const osskeyPath = path.resolve(process.cwd(), ".osskey.js");

    const hasInit = !fs.existsSync(configPath);
    if (hasInit) {
      const cryptoKey = createUid();
      const cryptoIv = createUid();
      const questions = [
        {
          type: "input",
          name: "localDir",
          message: "本地上传目录"
        },
        {
          type: "input",
          name: "remoteDir",
          message: "oss上传目录"
        },
        {
          type: "input",
          name: "region",
          message: "oss region"
        },
        {
          type: "input",
          name: "accessKeyId",
          message: "oss accessKeyId"
        },
        {
          type: "input",
          name: "accessKeySecret",
          message: "oss accessKeySecret"
        },
        {
          type: "input",
          name: "bucket",
          message: "oss bucket"
        }
      ];
      const {
        localDir,
        remoteDir,
        region,
        accessKeyId,
        accessKeySecret,
        bucket
      } = await inquirer.prompt(questions);

      const configTemple = `const {key, iv} = require("./.osskey.js")
module.exports = {
  key,
  iv,
  localDir:"${localDir}",
  remoteDir:"${remoteDir}",
  aliossOptions:{
    region: "${aesCrypto.AES_encrypt(region, cryptoKey, cryptoIv)}",
    accessKeyId: "${aesCrypto.AES_encrypt(accessKeyId, cryptoKey, cryptoIv)}",
    accessKeySecret: "${aesCrypto.AES_encrypt(
      accessKeySecret,
      cryptoKey,
      cryptoIv
    )}",
    bucket: "${aesCrypto.AES_encrypt(bucket, cryptoKey, cryptoIv)}"
  }
}
`;
      const osskeyTemplate = `module.exports = {
  key: "${cryptoKey}",
  iv: "${cryptoIv}"
}
`;
      fs.writeFile(configPath, configTemple, "utf8", (err: any) => {
        if (err) {
          console.log(chalk.red(`init err：${err}`));
        }
      });
      fs.writeFile(osskeyPath, osskeyTemplate, "utf8", (err: any) => {
        if (err) {
          console.log(chalk.red(`init err：${err}`));
        }
      });
      fs.ensureFileSync(ignoreFile);
    } else {
      console.log(chalk.red(`已存在配置文件，请删除后重试`));
    }
  }
};

export default register;
