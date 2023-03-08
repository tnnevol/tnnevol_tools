const { customAlphabet } = require("nanoid");

function createUid(): string {
  const nanoid = customAlphabet("1234567890abcdef", 16);
  return nanoid();
}
module.exports = createUid;
