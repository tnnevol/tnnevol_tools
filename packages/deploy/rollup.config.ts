import createRollupConfig, {
  addMjsExtensionsPlugin
} from "@tnnevol/rollup-helper";
import { defineConfig } from "rollup";

const outDir = "dist";
const inputDir = "src";
const compileDependencies = ["nanoid"];

export default defineConfig(
  createRollupConfig({
    inputDir,
    outDir,
    compileDependencies: compileDependencies,
    external: [
      "../utils",
      "../config",
      "./commands/init",
      "./commands/encryption",
      "./commands/publish"
    ],
    plugins: [
      addMjsExtensionsPlugin({
        indexModules: ["utils", "config"]
      })
    ]
  })
);
