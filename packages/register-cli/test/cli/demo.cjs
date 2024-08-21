#!/usr/bin/env node

const registerTask = require("../..");

registerTask([
  {
    name: "demo",
    description: "demo",
    register: function () {
      console.log("demo");
    }
  }
]);
