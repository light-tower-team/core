import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@light-tower-team/core",
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [tsconfigPaths()],
});
