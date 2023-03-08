import OSS from "ali-oss";
export declare interface ActionCommand {
  description: string;
  apply(args?: Record<string, any>[]): void | Promise<void>;
}

export declare type ActionFn = (
  ...args: Record<string, any>[]
) => void | Promise<void>;

export declare type AliossConfig = {
  key: string;
  iv: string;
  localDir: string;
  remoteDir: string;
  aliossOptions: Required<OSS.Options>;
};

export declare namespace AesCrypto {
  interface AesCrypto {
    AES_encrypt(message: string, key: string, iv: string): string;
    AES_decrypted(encrypted: string, key: string, iv: string): string;
  }
}
