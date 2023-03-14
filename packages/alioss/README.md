# @tnnevol/alioss

本项目是对 [ali-oss](https://www.npmjs.com/package/ali-oss#node-usage) 的二次集成，主要用于 `nodejs` 环境。

## CODE
[alioss](https://gitee.com/tnnevol/tnnevol_tools/tree/main/packages/alioss)

## 安装

```shell
# global
pnpm add @tnnevol/alioss -g

# project dev
pnpm add @tnnevol/alioss -D
```

## 使用

```shell
# 初始化项目
alioss init

# 上传
alioss upload

# 更换oss配置后需要重新加密
alioss encrypt
```

## 描述

使用 `alioss init` 初始化项目后，会在脚本运行的目录下创建 `alioss.config.js`、`.osskey.js`和`.ossignore`文件。


```javascript
// .osskey.js
// 每次初始化都会随机生成，此文件在项目中请不要上传，请将文件加入项目的ignore配置中，例如：.gitignore。
// 用于对alioss的原文配置进行加密，防止oss配置泄漏
module.exports = {
  key: "", // 加密key
  iv: "" // 加密iv
}
```

对于 `aliossOptions` 请参阅 [oss node配置项](https://www.alibabacloud.com/help/zh/object-storage-service/latest/configuration-items)
```javascript
// alioss.config.js
const {key, iv} = require("./.osskey.js")
module.exports = {
  key, // 加密key
  iv, // 加密iv
  localDir:"", // 本地需要上传的目录
  remoteDir:"", // alioss 的目录
  aliossOptions:{ // alioss的必要参数
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: ""
  }
}
```

文件配置请参阅 [ignore](https://www.npmjs.com/package/ignore)，.ossignore 内容会加入到 `add` 方法中，文件可使用 __#__ 作为注释。
```
# .ossignore
# 用于忽略上传的文件

# 忽略e2e文件夹下的所有文件
dist/e2e/*
# e2e下的plugins目录必须上传
!dist/e2e/plugins
```

后期 `aliossOptions` 配置项参数发生变化可使用 `alioss encrypt` 对变更后的明文重新加密，shell 会使用现有项目 `.osskey.js` 文件中的 `key` 和 `iv` 进行加密；也可以将项目中的 `alioss.config.js` 删除,重新初始化。

## feature

- Node.js上传本地文件