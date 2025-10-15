import { execSync } from "child_process";
import path from "path";
import assert from "assert";
import fs from "fs-extra";

const cli = path.resolve("./test", "cli/demo.mjs");

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
