import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { name } from "./package.json";
import { nodePolyfills } from "./plugins/vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "ES2017",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name,
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
  plugins: [
    tsconfigPaths(),
    nodePolyfills({
      include: ["buffer", "process"],
      globals: {
        Buffer: true,
        process: false,
        global: true,
      },
    }),
  ],
});
