import { customAlphabet } from "nanoid";

export default function createUid(): string {
  const nanoid = customAlphabet("1234567890abcdef", 16);
  return nanoid();
}
