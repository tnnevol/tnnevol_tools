interface ICLIOptions {
  [key: string]: number | string | boolean;
}
declare type CommandFunction = (options: ICLIOptions, ...args: any[]) => any;

/**
 * @typedef {Object} TaskRegister
 * @property {string} name - 任务名。
 * @property {string} description - 任务的简要描述。
 * @property {function(options: Object): Promise<void>} register - 注册任务并使用给定的选项运行它的函数。
 * @property {Object} [options] - 描述任务可用选项的对象。
 * @property {string} [examples] - 任务的使用示例。
 */
declare type TaskRegister = {
  name: string;
  description: string;
  register: CommandFunction;
  options?: {
    [key: string]: string;
  };
  examples?: string;
};

interface EnvConfig<T extends string> {
  name: T;
  script: string;
  host: string;
  port: number;
  username: string;
  password: string;
  distPath: string;
  webDir: string;
  bakDir: string;
  isRemoveRemoteFile: boolean;
  isRemoveLocalFile: boolean;
}

interface ServerConfig<T extends string> {
  [key: T]: EnvConfig<T>;
}

interface DeployConfig<T extends string> {
  projectName: string;
  // privateKey: string;
  // passphrase: string;
  cryptoKey: string;
  cryptoIv: string;
  serverConfig: ServerConfig<T>;
}
interface QuestionAnswerMap<T extends string> extends EnvConfig<T> {
  projectName: string;
  privateKey: string;
  passphrase: string;
}

interface PackageConfig {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: {
    [key: string]: string;
  };
  author: string;
  license: string;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
}
