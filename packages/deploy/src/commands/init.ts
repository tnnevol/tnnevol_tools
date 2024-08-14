import dedent from "dedent";
import { checkDeployConfigExists, output, createUid, aesCrypto } from "~/utils";
import { inquirerConfig, deployConfigPath } from "~/config";
import inquirer from "inquirer";
import fs from "fs";
import childProcess from "child_process";

// 获取用户输入信息
function getUserInputInfo() {
  return inquirer.prompt(inquirerConfig);
}

// 创建JSON对象
function createJsonObj(
  userInputInfo: QuestionAnswerMap<string>
): DeployConfig<string> {
  const cryptoKey = createUid();
  const cryptoIv = createUid();
  return {
    projectName: userInputInfo.projectName,
    // privateKey: userInputInfo.privateKey,
    // passphrase: userInputInfo.passphrase,
    cryptoKey,
    cryptoIv,
    serverConfig: {
      [userInputInfo.name]: {
        name: userInputInfo.name,
        script: userInputInfo.script,
        host: userInputInfo.host,
        port: userInputInfo.port,
        username: aesCrypto.encrypt(
          userInputInfo.username,
          cryptoKey,
          cryptoIv
        ),
        password: aesCrypto.encrypt(
          userInputInfo.password,
          cryptoKey,
          cryptoIv
        ),
        distPath: userInputInfo.distPath,
        webDir: userInputInfo.webDir,
        bakDir: userInputInfo.bakDir,
        isRemoveRemoteFile: !!userInputInfo.isRemoveRemoteFile,
        isRemoveLocalFile: !!userInputInfo.isRemoveLocalFile
      }
    }
  };
}

// 创建配置文件
function createConfigFile(jsonObj: DeployConfig<string>) {
  const str = `module.exports = ${JSON.stringify(jsonObj, null, 2)}`;
  fs.writeFileSync(deployConfigPath, str);
}
// 格式化配置文件
function formatConfigFile(): void {
  childProcess.execSync(`npx prettier --write ${deployConfigPath}`);
}

const register: TaskRegister = {
  name: "init",
  description: "部署配置初始化",
  options: {},
  examples: dedent``,
  async register() {
    if (checkDeployConfigExists()) {
      output.error("deploy.config.js 配置文件已存在");
    } else {
      const userInputInfo = await getUserInputInfo();
      createConfigFile(createJsonObj(userInputInfo));
      formatConfigFile();
      output.success(
        `
        请将配置文件中的 cryptoKey cryptoIv 俩个字段的值单独文件存放，重新引入到${output.underline(
          "deploy.config.js"
        )}中，并且不要上传到git，以确保服务器密码不被泄露。
        配置文件生成成功，请查看项目目录下的 ${output.underline(
          "deploy.config.js"
        )} 文件确认配置是否正确
        `
      );
    }
  }
};
export default register;
