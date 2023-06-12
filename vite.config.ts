import { defineConfig } from 'vite'
import path from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyComponentLib",
      fileName: (format) => `my-component-lib.${format}.js`,
    },
  }
})
