declare interface ActionCommand {
  description: string;
  apply(args?: Record<string, any>[]): void | Promise<void>;
}

declare type ActionFn = (
  ...args: Record<string, any>[]
) => void | Promise<void>;

declare interface AesCrypto {
  AES_encrypt(message: string, key: string, iv: string): string;
  AES_decrypted(encrypted: string, key: string, iv: string): string;
}
