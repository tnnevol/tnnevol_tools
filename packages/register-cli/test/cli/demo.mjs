#!/usr/bin/env node

import registerTask from "../../dist/index.mjs";

registerTask([
  {
    name: "demo",
    description: "demo",
    register: function () {
      console.log("demo");
    }
  }
]);
