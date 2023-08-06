import path from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { name } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name,
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [
    tsconfigPaths(),
    swc.vite({
      jsc: {
        target: "es2022", // Does not accept `esnext`
      },
    }),
  ],
});
