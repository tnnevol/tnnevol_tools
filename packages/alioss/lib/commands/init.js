(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const fs = require("fs-extra");
  const chalk = require("chalk");
  const path = require("path");
  const inquirer = require("inquirer");
  const createUid = require("../utils/create.uid");
  const { AES_encrypt } = require("../utils/aes.crypto");
  const command = {
      description: "alioss 初始化",
      async apply() {
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
              const { localDir, remoteDir, region, accessKeyId, accessKeySecret, bucket } = await inquirer.prompt(questions);
              const configTemple = `const {key, iv} = require("./.osskey.js")
module.exports = {
  key,
  iv,
  localDir:"${localDir}",
  remoteDir:"${remoteDir}",
  aliossOptions:{
    region: "${AES_encrypt(region, cryptoKey, cryptoIv)}",
    accessKeyId: "${AES_encrypt(accessKeyId, cryptoKey, cryptoIv)}",
    accessKeySecret: "${AES_encrypt(accessKeySecret, cryptoKey, cryptoIv)}",
    bucket: "${AES_encrypt(bucket, cryptoKey, cryptoIv)}"
  }
}
`;
              const osskeyTemplate = `module.exports = {
  key: "${cryptoKey}",
  iv: "${cryptoIv}"
}
`;
              fs.writeFile(configPath, configTemple, "utf8", (err) => {
                  if (err) {
                      console.log(chalk.red(`init err：${err}`));
                  }
              });
              fs.writeFile(osskeyPath, osskeyTemplate, "utf8", (err) => {
                  if (err) {
                      console.log(chalk.red(`init err：${err}`));
                  }
              });
              fs.ensureFileSync(ignoreFile);
          }
      }
  };
  module.exports = command;

}));
