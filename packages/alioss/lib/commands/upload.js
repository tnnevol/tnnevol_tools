(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    const fs = require("fs-extra");
    const ignore = require("ignore");
    const path = require("path");
    const OSS = require("ali-oss");
    const chalk = require("chalk");
    const { AES_decrypted } = require("../utils/aes.crypto");
    const command = {
        description: "alioss 上传",
        async apply() {
            console.time("上传时间：");
            const configPath = path.resolve(process.cwd(), "alioss.config.js");
            const config = require(configPath);
            const uploadDir = path.resolve(process.cwd(), config.localDir);
            const files = deepDir(uploadDir);
            const ignoreList = ossignoreProcess();
            const ig = ignore().add(ignoreList);
            const uploadPathFileList = ig.filter(files);
            const { key, iv } = config;
            const { region, accessKeyId, accessKeySecret, bucket } = config.aliossOptions;
            const ossClient = new OSS({
                region: AES_decrypted(region, key, iv),
                accessKeyId: AES_decrypted(accessKeyId, key, iv),
                accessKeySecret: AES_decrypted(accessKeySecret, key, iv),
                bucket: AES_decrypted(bucket, key, iv)
            });
            for (const _uploadPathFileList of groupListByLength(uploadPathFileList, 40)) {
                await Promise.all(_uploadPathFileList.map(async (filePath) => {
                    const remotePath = path.join(config.remoteDir, path.relative(uploadDir, filePath));
                    const { res } = await ossClient.put(remotePath, path.normalize(filePath));
                    console.log(chalk[res.status === 200 ? "green" : "red"](`${filePath} to oss ${remotePath} ${res.statusMessage}`));
                }));
            }
            console.timeEnd("上传时间：");
        }
    };
    module.exports = command;
    function groupListByLength(list, length = 20) {
        const group = [];
        const splitCount = Math.ceil(list.length / length);
        for (let i = 0; i < splitCount; i++) {
            group.push(list.slice(i * length, (i + 1) * length));
        }
        return group;
    }
    function deepDir(dir) {
        const files = [];
        getFile(dir);
        function getFile(dir) {
            fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
                const fullPath = path.resolve(dir, dirent.name);
                if (dirent.isFile()) {
                    files.push(path.relative(process.cwd(), fullPath));
                }
                else if (dirent.isDirectory()) {
                    getFile(fullPath);
                }
            });
        }
        return files;
    }
    function ossignoreProcess() {
        const ignoreFile = path.resolve(process.cwd(), ".ossignore");
        fs.ensureFileSync(ignoreFile);
        const ignoreContent = fs.readFileSync(ignoreFile, "utf8");
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

}));
