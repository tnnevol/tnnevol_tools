const assert = require("assert");
const path = require("path");
const fs = require("fs");
const pxtorem = require("..");
const postcss = require("postcss");
const cssnano = require("cssnano");

const resolve = p => path.join(__dirname, p);
const ASSETS_PATH = "./assets/";

describe("postcss-pxtorem", function () {
  it("[default] should output right rem file well with other plugins", async function () {
    const srcPath = resolve(`${ASSETS_PATH}source.css`);
    const srcText = fs.readFileSync(srcPath, { encoding: "utf8" });
    const expectText = fs.readFileSync(
      resolve(`${ASSETS_PATH}dest.basic.css`),
      { encoding: "utf8" }
    );
    const outputText = (
      await postcss()
        .use(
          cssnano({
            preset: "default"
          })
        )
        .use(pxtorem({ remUnit: 75 }))
        .process(srcText)
    ).css;

    const expectedText = (
      await postcss()
        .use(
          cssnano({
            preset: "default"
          })
        )
        .process(expectText)
    ).css;

    assert.equal(outputText, expectedText);
  });
});
