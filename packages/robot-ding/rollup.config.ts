import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import camelCase from "lodash.camelcase";

const libraryName = "index";
const outDir = "lib";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: `${outDir}/robot-ding.umd.js`,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: !production
    }
  ],
  external: [],
  watch: {
    include: "src/**"
  },
  plugins: [
    json(),
    typescript({
      sourceMap: !production
    }),
    commonjs({ extensions: [".js", ".ts"] }),
    nodeResolve()
  ]
};
