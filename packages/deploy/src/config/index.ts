import type { QuestionCollection } from "inquirer";
import type { QuestionAnswerMap } from "../../types";

const fs = require("fs");
const path = require("path");

export const inquirerConfig: QuestionCollection<QuestionAnswerMap<string>> = [
  {
    type: "input",
    name: "projectName",
    message: "请输入项目名称",
    default: fs.existsSync(`${path.join(process.cwd())}/package.json`)
      ? require(`${process.cwd()}/package.json`).name
      : ""
  },
  /*  {
    type: "input",
    name: "privateKey",
    message: "请输入本地私钥地址",
    default: `${os.homedir()}/.ssh/id_rsa`
  },
  {
    type: "password",
    name: "passphrase",
    message: "请输入本地私钥密码",
    default: ""
  },*/
  {
    type: "input",
    name: "name",
    message: "环境名称",
    default: "prod"
  },
  {
    type: "input",
    name: "script",
    message: "打包命令",
    default: "npm run build"
  },
  {
    type: "input",
    name: "host",
    message: "服务器地址"
  },
  {
    type: "number",
    name: "port",
    message: "服务器端口号",
    default: 22
  },
  {
    type: "input",
    name: "username",
    message: "用户名",
    default: "root"
  },
  {
    type: "password",
    name: "password",
    message: "密码"
  },
  {
    type: "input",
    name: "distPath",
    message: "本地打包目录",
    default: "dist"
  },
  {
    type: "input",
    name: "webDir",
    message: "部署路径"
  },
  {
    type: "input",
    name: "bakDir",
    message: "备份路径"
  },
  {
    type: "confirm",
    name: "isRemoveRemoteFile",
    message: "是否删除远程文件",
    default: true
  },
  {
    type: "confirm",
    name: "isRemoveLocalFile",
    message: "是否删除本地打包文件",
    default: true
  }
];

export const deployConfigPath = `${path.join(process.cwd())}/deploy.config.js`;
