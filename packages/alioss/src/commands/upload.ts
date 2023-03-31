import { ActionCommand, AliossConfig, AesCrypto } from "~types/index";
import type { Dirent } from "fs-extra";

const fs = require("fs-extra");
const ignore = require("ignore");
const path = require("path");
const OSS = require("ali-oss");
const chalk = require("chalk");
const { AES_decrypted }: AesCrypto.AesCrypto = require("../utils/aes.crypto");

const pathReg = /\\\\|\\/g;

const command: ActionCommand = {
  description: "alioss 上传",
  async apply() {
    console.time("上传时间：");
    const configPath = path.resolve(process.cwd(), "alioss.config.js");
    const config: AliossConfig = require(configPath);
    const uploadDir = path.resolve(process.cwd(), config.localDir);
    const files = deepDir(uploadDir);
    const ignoreList = ossignoreProcess();
    const ig = ignore().add(ignoreList);
    const uploadPathFileList = ig.filter(files);
    const { key, iv } = config;
    const { region, accessKeyId, accessKeySecret, bucket } =
      config.aliossOptions;
    const ossClient = new OSS({
      region: AES_decrypted(region, key, iv),
      accessKeyId: AES_decrypted(accessKeyId, key, iv),
      accessKeySecret: AES_decrypted(accessKeySecret, key, iv),
      bucket: AES_decrypted(bucket, key, iv)
    });
    for (const _uploadPathFileList of chunkListByLength(
      uploadPathFileList,
      40
    )) {
      await Promise.all(
        _uploadPathFileList.map(async filePath => {
          const remotePath = path.join(
            config.remoteDir.replace(pathReg, "/"),
            path.relative(uploadDir, filePath)
          );
          const { res } = await ossClient.put(
            remotePath,
            path.normalize(filePath)
          );
          console.log(
            chalk[res.status === 200 ? "green" : "red"](
              `${filePath} to oss ${remotePath} ${res.statusMessage}`
            )
          );
        })
      );
    }
    console.timeEnd("上传时间：");
  }
};

module.exports = command;

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
