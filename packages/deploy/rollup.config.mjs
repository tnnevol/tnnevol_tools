import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from '@rollup/plugin-terser';
import { defineConfig } from "rollup";

const outDir = "lib";
const inputDir = "src";

const production = !process.env.ROLLUP_WATCH;

const plugins = [
  typescript({
    sourceMap: !production
  }),
  json(),
  commonjs({ extensions: [".js", ".ts"] }),
  nodeResolve(),
  terser()
];

const inputConfigList = [
  {
    path: "index.ts",
    file: "index.js",
    name: "index",
  },
];

export default defineConfig(
  inputConfigList.map(info => ({
    input: `${inputDir}/${info.path}`,
    output: {
      file: `${outDir}/${info.file}`,
      format: "cjs",
      name: info.name,
      sourcemap: !production,
    },
    external: info.external, // 排除的模块或文件
    plugins
  }))
);
