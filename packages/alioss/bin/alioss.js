#!/usr/bin/env node

const registerTask = require("@tnnevol/register-cli");
const init = require("../dist/commands/init");
const encrypt = require("../dist/commands/encrypt");
const upload = require("../dist/commands/upload");

registerTask([init, encrypt, upload]);
