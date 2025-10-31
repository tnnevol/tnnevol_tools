import { pathToFileURL } from "node:url";
import type { AliossConfig } from "alioss";

/** 获取配置文件*/
export async function readAliossConfig(filePath: string) {
  return (await import(`${pathToFileURL(filePath).href}`))
    .default as AliossConfig;
}
