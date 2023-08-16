declare module "node-stdlib-browser/helpers/esbuild/plugin" {
  import { Plugin } from "esbuild";

  export default function (options: Record<string, string>): Plugin;
}
