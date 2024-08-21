#!/usr/bin/env node

const registerTask = require("@tnnevol/register-cli");
const init = require("../dist/commands/init");
const encryption = require("../dist/commands/encryption");
const publish = require("../dist/commands/publish");

registerTask([init, encryption, publish]);
