import path from "node:path";
import stdLibBrowser from "node-stdlib-browser";
import { defineConfig } from "vite";
import { ModuleNameWithoutNodePrefix, nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

import { name } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "ES2017",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name,
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [
    tsconfigPaths(),
    nodePolyfills({
      exclude: Object.keys(stdLibBrowser).filter(
        (lib) => !lib.startsWith("node:") && !["process"].includes(lib)
      ) as ModuleNameWithoutNodePrefix[],
      globals: {
        Buffer: true,
        process: "build",
        global: true,
      },
    }),
  ],
});
