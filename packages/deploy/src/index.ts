import registerTask from "@tnnevol/register-cli";
import init from "./commands/init";
import encryption from "./commands/encryption";
import publish from "./commands/publish";

registerTask([init, encryption, publish]);
