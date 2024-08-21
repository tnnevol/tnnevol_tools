import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  clean: true,
  entries: ["src/index"],
  declaration: true,
  outDir: "dist",
  alias: {},
  rollup: {
    emitCJS: true,
    cjsBridge: true
  }
});
