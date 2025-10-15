import createRollupConfig, {
  addMjsExtensionsPlugin
} from "@tnnevol/rollup-helper";
import { defineConfig } from "rollup";

const outDir = "dist";
const inputDir = "src";
const compileDependencies = [];

export default defineConfig(
  createRollupConfig({
    inputDir,
    outDir,
    compileDependencies: compileDependencies,
    plugins: [
      addMjsExtensionsPlugin({
        indexModules: ["utils", "config"]
      })
    ]
  })
);
