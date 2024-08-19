import OSS from "ali-oss";

export type AliossConfig = {
  key: string;
  iv: string;
  localDir: string;
  remoteDir: string;
  aliossOptions: Required<OSS.Options>;
};
