import camelCase from "lodash.camelcase";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const libraryName = "index";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: "lib/robot-ding.umd.js",
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: !production
    }
    // { file: "lib/robot-ding.es5.js", format: "es", sourcemap: true }
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
