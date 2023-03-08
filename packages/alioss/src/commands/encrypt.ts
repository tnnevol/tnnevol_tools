import { ActionCommand } from "~types/index";

const { AES_encrypt } = require("../utils/aes.crypto");

const command: ActionCommand = {
  description: "alioss 加密",
  async apply() {
    console.log(AES_encrypt);
    // todo
  }
};

module.exports = command;
