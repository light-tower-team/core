import fg from "fast-glob";
import stdLibBrowser from "node-stdlib-browser";
import { defineConfig } from "vite";
import { ModuleNameWithoutNodePrefix, nodePolyfills } from "vite-plugin-node-polyfills";
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
      formats: ["es"],
    },
  },
  plugins: [
    tsconfigPaths(),
    nodePolyfills({
      exclude: Object.keys(stdLibBrowser) as ModuleNameWithoutNodePrefix[],
      globals: {
        Buffer: true,
        global: true,
        process: false,
      },
      protocolImports: true,
    }),
  ],
});
