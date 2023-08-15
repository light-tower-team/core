import g from "@rollup/plugin-inject";
import { createRequire as d } from "node:module";
import m from "node-stdlib-browser";
import h from "node-stdlib-browser/helpers/esbuild/plugin";
import { handleCircularDependancyWarning as B } from "node-stdlib-browser/helpers/rollup/plugin";
const y = ["buffer", "global", "process"].flatMap((l) => [l, `node:${l}`]),
  p = (l) => (l ? (l === !0 ? !0 : l === "build") : !1),
  n = (l) => (l ? (l === !0 ? !0 : l === "dev") : !1),
  P = (l) => l.startsWith("node:"),
  I = (l = {}) => {
    const e = d(import.meta.url).resolve("vite-plugin-node-polyfills/shims"),
      o = {
        include: [],
        exclude: [],
        protocolImports: !0,
        ...l,
        globals: {
          Buffer: !0,
          global: !0,
          process: !0,
          ...l.globals,
        },
      },
      c = (i) => o.exclude.some((s) => i === s || i === `node:${s}`),
      b = (i) => o.include.some((s) => i === s || i === `node:${s}`);
    return {
      name: "vite-plugin-node-polyfills",
      config: (i, s) => {
        const f = s.mode === "development",
          a = Object.entries(m).reduce(
            (t, [r, u]) => (
              (!o.protocolImports && P(r)) || ((o.include.length ? b(r) : !c(r)) && (t[r] = y.includes(r) ? e : u)), t
            ),
            {}
          );
        return {
          build: {
            rollupOptions: {
              onwarn: (t, r) => {
                B(t, r);
              },
              plugins: [
                {
                  ...g({
                    // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md#vite
                    ...(p(o.globals.Buffer) ? { Buffer: [e, "Buffer"] } : {}),
                    ...(p(o.globals.global) ? { global: [e, "global"] } : {}),
                    ...(p(o.globals.process) ? { process: [e, "process"] } : {}),
                  }),
                },
              ],
            },
          },
          esbuild: {
            // In dev, the global polyfills need to be injected as a banner in order for isolated scripts (such as Vue SFCs) to have access to them.
            banner: [
              f && n(o.globals.Buffer)
                ? `import { Buffer as BufferPolyfill } from '${e}'
globalThis.Buffer = BufferPolyfill`
                : "",
              f && n(o.globals.global)
                ? `import { global as globalPolyfill } from '${e}'
globalThis.global = globalPolyfill`
                : "",
              f && n(o.globals.process)
                ? `import { process as processPolyfill } from '${e}'
globalThis.process = processPolyfill`
                : "",
            ].join(`
`),
          },
          optimizeDeps: {
            esbuildOptions: {
              // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md?plain=1#L203-L209
              define: {
                ...(n(o.globals.Buffer) ? { Buffer: "Buffer" } : {}),
                ...(n(o.globals.global) ? { global: "global" } : {}),
                ...(n(o.globals.process) ? { process: "process" } : {}),
              },
              inject: [e],
              plugins: [
                h(a),
                // Supress the 'injected path "..." cannot be marked as external' error in Vite 4 (emitted by esbuild).
                // https://github.com/evanw/esbuild/blob/edede3c49ad6adddc6ea5b3c78c6ea7507e03020/internal/bundler/bundler.go#L1469
                {
                  name: "vite-plugin-node-polyfills-shims-resolver",
                  setup(t) {
                    const r = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                      u = new RegExp(`^${r}$`);
                    t.onResolve({ filter: u }, () => ({
                      // https://github.com/evanw/esbuild/blob/edede3c49ad6adddc6ea5b3c78c6ea7507e03020/internal/bundler/bundler.go#L1468
                      external: !1,
                      path: e,
                    }));
                  },
                },
              ],
            },
          },
          resolve: {
            // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md?plain=1#L150
            alias: {
              ...a,
            },
          },
        };
      },
    };
  };
export { I as nodePolyfills };
//# sourceMappingURL=index.js.map
