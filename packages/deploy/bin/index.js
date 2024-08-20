#!/usr/bin/env node

const registerTask = require("@tnnevol/register-cli");
const init = require("../lib/commands/init");
const encryption = require("../lib/commands/encryption");
const publish = require("../lib/commands/publish");

registerTask([init, encryption, publish]);
