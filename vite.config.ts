import fg from "fast-glob";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

import { name } from "./package.json";

const files = fg.sync(["src/**/!(*.spec|*.test|*.d).ts", "!src/**/__tests__/**/*"]).map((file) => {
  const [key] = file.match(/(?<=src\/).*(?=\.ts)/);
  return [key, file];
});

const entries = Object.fromEntries(files);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "ES2017",
    sourcemap: true,
    lib: {
      entry: entries,
      name,
      formats: ["es", "cjs"],
    },
  },
  plugins: [
    tsconfigPaths(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: false,
        global: true,
      },
      protocolImports: true,
    }),
  ],
});
