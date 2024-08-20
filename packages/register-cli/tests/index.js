const { execSync } = require("child_process");
const path = require("path");
const assert = require("assert");
const fs = require("fs-extra");

const cli = path.join(__dirname, "./cli/demo.js");

describe("register-cli", function () {
  it("should register task --help", function () {
    const result = execSync(`${cli} --help`);
    assert.ok(typeof result.toString() === "string");
  });

  it("should register task version", function () {
    const { version } = fs.readJSONSync(
      path.join(process.cwd(), "./package.json")
    );
    const result = execSync(`${cli} version`);
    assert.equal(result.toString().trim(), version);
  });

  it("should register task demo", function () {
    const result = execSync(`${cli} demo`);
    assert.equal(result.toString().trim(), "demo");
  });
});
