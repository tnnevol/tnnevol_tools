import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
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
];

const inputs = [
  {
    path: "register.ts",
    file: "register.js",
    name: "register"
  },
  {
    path: "commands/init.ts",
    file: "commands/init.js",
    name: "init"
  },
  {
    path: "commands/upload.ts",
    file: "commands/upload.js",
    name: "upload"
  },
  {
    path: "commands/encrypt.ts",
    file: "commands/encrypt.js",
    name: "encrypt"
  },
  {
    path: "utils/create.uid.ts",
    file: "utils/create.uid.js",
    name: "create.uid"
  },
  {
    path: "utils/aes.crypto.ts",
    file: "utils/aes.crypto.js",
    name: "aes.crypto"
  }
];

export default defineConfig(
  inputs.map(info => ({
    input: `${inputDir}/${info.path}`,
    output: {
      file: `${outDir}/${info.file}`,
      format: "umd",
      name: info.name,
      sourcemap: !production
    },
    plugins
  }))
);
