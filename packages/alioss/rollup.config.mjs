import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "rollup";
import fs from "fs-extra";
import path from "path";

const outDir = "dist";
const inputDir = "src";
const compileDependencies = ["nanoid"];

// 需要编译的包
const production = !process.env.ROLLUP_WATCH;

const packagesJson = fs.readJSONSync("./package.json");
const dependencies = Object.keys(packagesJson.dependencies);

const externalFiles = [
  "utils/*.ts",
  ...dependencies.filter(name => !compileDependencies.includes(name))
];

const plugins = [
  typescript(),
  json(),
  commonjs({
    extensions: [".js", ".ts"]
  }),
  nodeResolve({
    mainFields: ["module", "main"],
    preferBuiltins: true
  }),
  terser()
];

/**
 * 文件配置信息
 *
 * @typedef {Object} InputConfig
 * @property {string} path - 文件路径。
 * @property {string} file - 文件名。
 * @property {string} name - 文件标识名。
 * @property {string | (string | RegExp)[]} [external] - 排除的模块或文件。
 */

/**
 *
 * @type {InputConfig[]}
 * @example
 *   {
 *     path: "index.ts",
 *     file: "index.js",
 *     name: "index",
 *   }
 */
const inputConfigList = [];

function createInputConfigList(dir = inputDir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isFile()) {
      const fileRelativePath = path.relative(inputDir, filePath);
      inputConfigList.push({
        path: fileRelativePath,
        // output file name
        file: fileRelativePath.replace(/\.ts$/, ".js"),
        name: fileRelativePath.replace(/\.ts$/, ""),
        external: externalFiles
      });
    } else if (fileStats.isDirectory()) {
      createInputConfigList(`${dir}/${file}`);
    }
  });
}
createInputConfigList();

export default defineConfig(
  inputConfigList.map(info => ({
    input: `${inputDir}/${info.path}`,
    output: {
      file: `${outDir}/${info.file}`,
      format: "cjs",
      name: info.name,
      sourcemap: !production
    },
    external: info.external, // 排除的模块或文件
    plugins
  }))
);
