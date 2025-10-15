import type { Dirent } from "fs-extra";
import OSS from "ali-oss";
import fs from "fs-extra";
import ignore from "ignore";
import path from "path";
import chalk from "chalk";
import type { AliossConfig } from "alioss";
import aesCrypto from "../utils/aes.crypto";
import type { TaskRegister } from "@tnnevol/register-cli";

const pathReg = /\\\\|\\/g;
const register: TaskRegister = {
  name: "upload",
  description: "alioss 上传",
  async register() {
    console.time("上传时间：");
    const configPath = path.resolve(process.cwd(), "alioss.config.js");
    const config: AliossConfig = (await import(configPath)).default;
    const uploadDir = path.resolve(process.cwd(), config.localDir);
    const files = deepDir(uploadDir);
    const ignoreList = ossignoreProcess();
    const ig = ignore().add(ignoreList);
    const uploadPathFileList = ig.filter(files);
    const { key, iv } = config;
    const { region, accessKeyId, accessKeySecret, bucket } =
      config.aliossOptions;
    const ossClient = new OSS({
      ...config.aliossOptions,
      region: aesCrypto.AES_decrypted(region, key, iv),
      accessKeyId: aesCrypto.AES_decrypted(accessKeyId, key, iv),
      accessKeySecret: aesCrypto.AES_decrypted(accessKeySecret, key, iv),
      bucket: aesCrypto.AES_decrypted(bucket, key, iv)
    });
    const toolsOss = ossTools(ossClient);
    for (const _uploadPathFileList of chunkListByLength(
      uploadPathFileList,
      40
    )) {
      await Promise.all(
        _uploadPathFileList.map(async filePath => {
          const remotePath = path
            .join(config.remoteDir, path.relative(uploadDir, filePath))
            .replace(pathReg, "/");
          if (await toolsOss.isExistObject(remotePath)) {
            console.log(chalk.green(`${filePath} 文件已存在`));
          } else {
            const { res } = await ossClient.put(
              remotePath,
              path.normalize(filePath)
            );
            console.log(
              chalk[res.status === 200 ? "green" : "red"](
                `${filePath} to oss ${remotePath} ${res.statusMessage}`
              )
            );
          }
        })
      );
    }
    console.timeEnd("上传时间：");
  }
};

export default register;

type GroupList<T> = Array<T>;

function chunkListByLength<T>(list: GroupList<T>, length = 20): GroupList<T>[] {
  const splitCount = Math.ceil(list.length / length);
  // 使用 Array.from 方法来创建一个长度为 splitCount 的数组，并使用 map 函数来对每个元素进行分割操作
  return Array.from({ length: splitCount }, (_, i) =>
    list.slice(i * length, (i + 1) * length)
  );
}

function deepDir(dir: string): string[] {
  const files: string[] = [];
  getFile(dir);

  function getFile(dir: string) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent: Dirent) => {
      const fullPath = path.resolve(dir, dirent.name);
      if (dirent.isFile()) {
        files.push(path.relative(process.cwd(), fullPath));
      } else if (dirent.isDirectory()) {
        getFile(fullPath);
      }
    });
  }

  return files;
}

function ossignoreProcess(): string[] {
  const ignoreFile = path.resolve(process.cwd(), ".ossignore");
  fs.ensureFileSync(ignoreFile);
  const ignoreContent: string = fs.readFileSync(ignoreFile, "utf8");
  return ignoreContent
    .trim()
    .split("\n")
    .filter(function (content) {
      if (content) {
        return !/^#\s?/.test(content);
      }
      return !!content;
    });
}

function ossTools(client: OSS.ClusterClient) {
  return {
    async isExistObject(name: string, options: OSS.HeadObjectOptions = {}) {
      try {
        await client.head(name, options);
        return true;
      } catch (error: any) {
        if (error?.code === "NoSuchKey") {
          return false;
        }
        throw new Error(error);
      }
    }
  };
}
