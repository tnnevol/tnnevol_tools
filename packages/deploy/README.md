# @tnnevol/deploy

## 注：
不想写核心部分了，对 [deploy-cli-service](https://github.com/fuchengwei/deploy-cli-service) 项目的v1.3.0进行了一些改动，特注于此。如有版权问题，可随时改动。(主要项目不想使用私钥并且密码不想明文😢)

## 安装

```shell
# npm global
npm i @tnnevol/deploy -g
# or dev
npm i @tnnevol/deploy -D
```

## 使用

```shell
npx deploy --help

# 初始化
npx deploy init

# 对新的文案进行加密
npx deploy encryption

# 部署 env 的值对应 配置文件 serverConfig 中的 key
npx deploy publish --env=test
```

## 配置文件

配置文件生成后，请将 `cryptoKey` 和 `cryptoIv`，存放到其他文件并且该文件不要提交到线上。

```javascript
const { cryptoKey, cryptoIv } = require("./.key");
module.exports = {
  projectName: "@examples/deploy",
  cryptoKey,
  cryptoIv,
  serverConfig: {
    test: {
      name: "test",
      script: "npm run build",
      host: "0.0.0.0",
      port: 22,
      username: "666",
      password: "999",
      distPath: "dist",
      webDir: "/www/99/66",
      bakDir: "",
      isRemoveRemoteFile: false,
      isRemoveLocalFile: true
    }
  }
};

```
