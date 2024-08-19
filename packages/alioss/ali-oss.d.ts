/// <reference types="@types/ali-oss" />

import OSS from "ali-oss";

declare module "ali-oss" {
  namespace OSS {
    interface NormalSuccessResponse {
      statusMessage: string;
    }
  }
}

export = OSS;
