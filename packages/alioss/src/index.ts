import registerTask from "@tnnevol/register-cli";
import init from "./commands/init";
import encrypt from "./commands/encrypt";
import upload from "./commands/upload";

registerTask([init, encrypt, upload]);
