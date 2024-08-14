import postcss from "postcss";
import Px2rem, { Options } from "px2rem";

function pxtoremPlugin(option: Options = {}): postcss.AcceptedPlugin {
  return {
    postcssPlugin: "postcss-pxtorem",
    prepare() {
      return {
        Once(root) {
          const oldCssText = root.toString();
          const px2remIns = new Px2rem(option);
          const newCssText = px2remIns.generateRem(oldCssText);
          const newRoot = postcss.parse(newCssText);
          root.removeAll();
          root.append(newRoot);
        }
      };
    }
  };
}
pxtoremPlugin.postcss = true;

export default pxtoremPlugin;
