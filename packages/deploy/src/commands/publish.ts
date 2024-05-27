import { deployConfigPath } from "~/config";
import dedent from "dedent";
import { aesCrypto, checkDeployConfigExists, output } from "~/utils";
import { DistinctQuestion } from "inquirer";
import fs from "fs";
import path from "path";
import ora from "ora";
import dayjs from "dayjs";
import inquirer from "inquirer";
import archiver from "archiver";
import { NodeSSH } from "node-ssh";
import { sh } from "tasksfile";

const ssh = new NodeSSH();

// 解密
function deployConfigForDecrypted(
  key: string,
  iv: string,
  envConfig: EnvConfig<string>
): EnvConfig<string> {
  return Object.assign(envConfig, {
    username: aesCrypto.decrypt(envConfig.username, key, iv),
    password: aesCrypto.decrypt(envConfig.password, key, iv)
  });
}

interface TaskFn<T = any> {
  (...args: any[]): Promise<T>;
}
type TaskRegisterFn<T> = TaskFn<T>;
let taskList: Array<TaskRegisterFn<any>> = [];

// 执行 script 脚本
async function execBuildTask(config: EnvConfig<string>, index: number) {
  try {
    const { script } = config;
    output.log(`(${index}) ${script}`);
    await sh(script, {
      async: true,
      nopipe: true
    });
  } catch (e) {
    output.error("打包失败");
    output.error(e as unknown as string);
    process.exit(1);
  }
}

// 压缩
function buildZipTask(config: EnvConfig<string>, index: number) {
  return new Promise<void>((resolve, reject) => {
    console.log(`(${index}) 打包 ${output.underline(config.distPath)} Zip`);
    const spinner = ora("正在打包中\n");
    spinner.start();
    const archive = archiver("zip", {
      zlib: { level: 9 }
    }).on("error", (e: any) => {
      output.error(e as unknown as string);
    });

    const outputContent = fs
      .createWriteStream(`${process.cwd()}/${config.distPath}.zip`)
      .on("close", (e: any) => {
        if (e) {
          output.error(`打包zip出错: ${e}`);
          reject(e);
          process.exit(1);
        } else {
          spinner.stop();
          output.success(
            `${output.underline(`${config.distPath}.zip`)} 打包成功`
          );
          resolve();
        }
      });

    archive.pipe(outputContent);
    archive.directory(config.distPath, false);
    archive.finalize();
  });
}

// ssh 链接
async function connectSSHTask(config: EnvConfig<string>, index: number) {
  try {
    output.log(`(${index}) ssh连接 ${output.underline(config.host)}`);
    const { username, password } = config;
    if (username) {
      if (!password) {
        const answers = await inquirer.prompt([
          {
            type: "password",
            name: "password",
            message: "请输入服务器密码"
          }
        ]);
        config.password = answers.password;
      }
      await ssh.connect(config);
      output.success("ssh连接成功");
    } else {
      output.error(`请配置${config.name}环境用户名`);
      process.exit(1);
    }
  } catch (e) {
    output.error(e as unknown as string);
    process.exit(1);
  }
}

async function uploadLocalFileTask(config: EnvConfig<string>, index: number) {
  try {
    const localFileName = `${config.distPath}.zip`;
    const remoteFileName = `${config.webDir}.zip`;
    const localPath = path.join(process.cwd(), localFileName); // `${process.cwd()}/${localFileName}`

    output.log(
      `(${index}) 上传本地文件 ${output.underline(
        config.distPath
      )} 到服务器 ${output.underline(`${config.webDir}`)}`
    );

    const spinner = ora("正在上传中\n");

    spinner.start();
    await ssh.putFile(localPath, remoteFileName, null, {
      concurrency: 1
    });
    spinner.stop();
    output.success("上传成功");
  } catch (e) {
    output.error(`上传失败：${e}`);
    process.exit(1);
  }
}

async function backupRemoteFileTask(config: EnvConfig<string>, index: number) {
  try {
    const { webDir, bakDir } = config;
    const dirName = webDir.split("/")[webDir.split("/").length - 1];
    const zipFileName = `${dirName}_${dayjs().format(
      "YYYY-MM-DD_HH:mm:ss"
    )}.zip`;

    output.log(`(${index}) 备份远程文件 ${output.underline(webDir)}`);

    await ssh.execCommand(`[ ! -d ${bakDir} ] && mkdir ${bakDir}`);

    await ssh.execCommand(`zip -q -r ${bakDir}/${zipFileName} ${webDir}`);

    output.success(
      `备份成功 备份至 ${output.underline(`${bakDir}/${zipFileName}`)}`
    );
  } catch (e) {
    output.error(`备份失败：${e}`);
    process.exit(1);
  }
}

async function removeRemoteFileTask(config: EnvConfig<string>, index: number) {
  try {
    const { webDir } = config;
    output.log(`(${index}) 删除远程文件 ${output.underline(webDir)}`);
    await ssh.execCommand(`rm -rf ${webDir}`);
    output.success("删除成功");
  } catch (e) {
    output.error(`删除失败：${e}`);
    process.exit(1);
  }
}
async function unzipRemoteFileTask(config: EnvConfig<string>, index: number) {
  try {
    const { webDir } = config;
    const remoteFileName = `${webDir}.zip`;
    output.log(`(${index}) 解压远程文件 ${output.underline(remoteFileName)}`);
    const { stdout, stderr } = await ssh.execCommand(
      `unzip -o ${remoteFileName} -d ${webDir} && rm -rf ${remoteFileName}`
    );
    if (stderr) throw stderr;
    output.log(stdout);
    output.success("解压成功");
  } catch (e) {
    output.error(`解压失败：${e}`);
    process.exit(1);
  }
}

async function removeLocalFileTask(config: EnvConfig<string>, index: number) {
  try {
    const localPath = `${process.cwd()}/${config.distPath}`;
    output.log(`(${index}) 删除本地文件 ${output.underline(localPath)}`);
    const remove = (path: string) => {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file: string) => {
          const currentPath = `${path}/${file}`;
          if (fs.statSync(currentPath).isDirectory()) {
            remove(currentPath);
          } else {
            fs.unlinkSync(currentPath);
          }
        });
        fs.rmdirSync(path);
      }
    };
    remove(localPath);
    fs.unlinkSync(`${localPath}.zip`);
    output.success("删除成功");
  } catch (e) {
    output.error(`删除失败：${e}`);
    process.exit(1);
  }
}

async function closeSSHTask() {
  ssh.dispose();
}

function createTaskList(config: EnvConfig<string>) {
  const {
    script,
    bakDir,
    isRemoveRemoteFile = true,
    isRemoveLocalFile = true
  } = config;

  taskList = [];
  script && taskList.push(execBuildTask);
  taskList.push(buildZipTask);
  taskList.push(connectSSHTask);
  taskList.push(uploadLocalFileTask);
  bakDir && taskList.push(backupRemoteFileTask);
  isRemoveRemoteFile && taskList.push(removeRemoteFileTask);
  taskList.push(unzipRemoteFileTask);
  isRemoveLocalFile && taskList.push(removeLocalFileTask);
  taskList.push(closeSSHTask);
}

async function executeTaskList(config: EnvConfig<string>) {
  for (const [index, execute] of new Map(
    taskList.map((execute, index) => [index, execute])
  )) {
    await execute(config, index + 1);
  }
}

interface ConfirmQuestion {
  confirm: boolean;
}
function confirmDeploy(message: string): Promise<ConfirmQuestion> {
  const questions: DistinctQuestion<ConfirmQuestion>[] = [
    {
      type: "confirm",
      name: "confirm",
      message
    }
  ];
  return inquirer.prompt(questions);
}

// 检查部署的环境参数是否正常
function checkEnvCorrect(
  config: DeployConfig<string>,
  env: keyof ServerConfig<string>
): void {
  const keys: string[] = [
    "name",
    "host",
    "port",
    "username",
    "distPath",
    "webDir"
  ];
  const envConfig = config.serverConfig[env];
  if (config && envConfig) {
    keys.forEach(key => {
      if (!envConfig[key] || envConfig[key] === "/") {
        output.error(
          `配置错误: ${output.underline(`${env}环境`)}${output.underline(
            `${key}属性`
          )}配置不正确`
        );
        process.exit(1);
      }
    });
  } else {
    output.error("配置错误: 未指定部署环境或指定部署环境不存在");
    process.exit(1);
  }
}

const register: TaskRegister = {
  name: "publish",
  description: "部署发布",
  options: {
    env: "必选 部署环境, 环境的值对应 配置文件中 serverConfig 的 key",
    unprompt: "取消提示确认"
  },
  examples: dedent`
    deploy publish --env=prod
    deploy publish --env=prod --unprompt
  `,
  async register(options: ICLIOptions) {
    if (checkDeployConfigExists()) {
      const config: DeployConfig<string> = require(deployConfigPath);
      const projectName = config.projectName;
      const currentTime = new Date().getTime();
      // 检查环境是否存在
      const { env, unprompt } = options;
      if (env) {
        let isDeploy = !!unprompt;
        checkEnvCorrect(config, env as keyof ServerConfig<string>);
        const envConfig = deployConfigForDecrypted(
          config.cryptoKey,
          config.cryptoIv,
          config.serverConfig[env as keyof ServerConfig<string>]
        );
        if (!isDeploy) {
          const answers = await confirmDeploy(
            `${output.underline(projectName)} 项目是否部署到 ${output.underline(
              envConfig.name
            )}?`
          );
          isDeploy = answers.confirm;
        }
        if (isDeploy) {
          createTaskList(envConfig);
          await executeTaskList(envConfig);
          output.success(
            `恭喜您，${output.underline(projectName)}项目已在${output.underline(
              envConfig.name
            )}部署成功 耗时${(new Date().getTime() - currentTime) / 1000}s\n`
          );
        } else {
          process.exit(1);
        }
      } else {
        output.error("请选择部署环境");
        process.exit(1);
      }
    } else {
      output.error("deploy.config.js 文件不存，请使用 deploy init 命令创建");
      process.exit(1);
    }
  }
};

export default register;
