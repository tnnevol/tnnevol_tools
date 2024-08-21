import { deployConfigPath } from "../config";
import { customAlphabet } from "nanoid";
import ora from "ora";
import chalk from "chalk";
import CryptoJS from "crypto-js";
import fs from "fs";

export function createUid(): string {
  const nanoid = customAlphabet("1234567890abcdef", 16);
  return nanoid();
}

export function checkDeployConfigExists() {
  return fs.existsSync(deployConfigPath);
}

interface Output {
  log: (message: string) => void;

  success: (...message: string[]) => void;

  info: (...message: string[]) => void;

  error: (...message: string[]) => void;

  underline: (message: string) => string;
}

interface AesCrypto {
  encrypt: (message: string, key: string, iv: string) => string;

  decrypt: (message: string, key: string, iv: string) => string;
}

export const output: Output = {
  log(message: string) {
    console.log(message);
  },
  success(...messages: string[]) {
    ora().succeed(chalk.greenBright.bold(...messages));
  },
  info(...messages: string[]) {
    ora().info(chalk.blueBright.bold(...messages));
  },
  error(...messages: string[]) {
    ora().fail(chalk.redBright.bold(...messages));
  },
  underline(message: string) {
    return chalk.underline.blueBright.bold(message);
  }
};

export const aesCrypto: AesCrypto = {
  encrypt(message: string, key: string, iv: string) {
    const srcs = CryptoJS.enc.Utf8.parse(message);
    const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString().toUpperCase();
  },
  decrypt(message: string, key: string, iv: string) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(message);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
};
