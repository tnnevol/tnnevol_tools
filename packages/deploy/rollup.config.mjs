import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "rollup";
import fs from "fs";
import path from "path";

const outDir = "lib";
const inputDir = "src";

const production = !process.env.ROLLUP_WATCH;

const plugins = [
  typescript({}),
  json(),
  commonjs({ extensions: [".js", ".ts"] }),
  nodeResolve(),
  terser()
];

const inputConfigList = [
  /*  {
    path: "index.ts",
    file: "index.js",
    name: "index",
  },*/
];

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
        name: fileRelativePath.replace(/\.ts$/, "")
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
