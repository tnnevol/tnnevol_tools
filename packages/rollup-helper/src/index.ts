import type { RollupOptions, InputPluginOption, ExternalOption } from "rollup";
import fs from "fs-extra";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export type InputConfig = {
  path: string;
  file: string;
  name: string;
  external?: ExternalOption;
};

export interface Option {
  inputDir: string;
  outDir: string;
  compileDependencies?: string[];
  external?: ExternalOption;
  plugins?: InputPluginOption[];
}

export default function createRollupConfig(option: Option): RollupOptions[] {
  // const fs = require("fs-extra");
  // 需要编译的包
  const cwdPath = path.resolve(process.cwd());
  const production = !process.env.ROLLUP_WATCH;
  const packagesJson = fs.readJsonSync(path.join(cwdPath, "package.json"));
  const dependencies = Object.keys(packagesJson.dependencies);
  const externalFiles = [
    ...dependencies.filter(name => !option?.compileDependencies?.includes(name))
  ];
  const plugins: InputPluginOption = [
    commonjs({
      extensions: [".js", ".ts"]
    }),
    typescript(),
    json(),
    nodeResolve({
      mainFields: ["module", "main"],
      preferBuiltins: true
    }),
    terser(),
    ...(option.plugins || [])
  ];
  const inputConfigList: InputConfig[] = [];

  if (Object.prototype.toString.call(option.external) === "[object Array]") {
    externalFiles.push(...(option.external as []));
  } else if (
    ["[object String]", "[object RegExp]"].includes(
      Object.prototype.toString.call(option.external)
    )
  ) {
    externalFiles.push(option.external as string);
  }
  function createInputConfigList(dir: string = option.inputDir) {
    const files: string[] = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const fileStats = fs.statSync(filePath);
      if (fileStats.isFile()) {
        const fileRelativePath = path.relative(option.inputDir, filePath);
        inputConfigList.push({
          path: fileRelativePath,
          // output file name
          file: fileRelativePath.replace(/\.ts$/, ".mjs"),
          name: fileRelativePath.replace(/\.ts$/, ""),
          external:
            Object.prototype.toString.call(option.external) ===
            "[object Function]"
              ? option.external
              : externalFiles
        });
      } else if (fileStats.isDirectory()) {
        createInputConfigList(`${dir}/${file}`);
      }
    });
  }

  createInputConfigList();
  return inputConfigList.map(info => ({
    input: `${option.inputDir}/${info.path}`,
    output: {
      file: `${option.outDir}/${info.file}`,
      format: "esm",
      name: info.name,
      sourcemap: !production
    },
    external: info.external, // 排除的模块或文件
    plugins
  }));
}

interface AddMjsExtensionsPluginOption {
  /**
   * 目录下面是index文件的模块
   */
  indexModules?: string[];
  /**
   * 指定模块名称
   */
  modules?: string[];
}
/**
 * import from 文件编译后自动添加 mjs 后缀名
 */
export function addMjsExtensionsPlugin(option: AddMjsExtensionsPluginOption) {
  const mergeOption = Object.assign({} as AddMjsExtensionsPluginOption, option);
  return {
    name: "add-mjs-extensions",
    renderChunk(code) {
      // 自动将相对导入的路径添加 .mjs 扩展名
      return code.replace(/from\s?["']([\w/]*[^"']+)["']/g, (match, path) => {
        // 如果路径不以 .mjs 结尾且是相对导入，则添加 .mjs
        if (mergeOption.indexModules?.some(m => path.endsWith(m))) {
          return `from "${path}/index.mjs"`;
        } else if (
          !path.endsWith(".mjs") &&
          ["./", "../"].some(s => path.startsWith(s))
        ) {
          return `from"${path}.mjs"`;
        }
        return match;
      });
    }
  } as InputPluginOption;
}
