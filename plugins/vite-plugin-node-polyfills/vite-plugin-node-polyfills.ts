import inject, { RollupInjectOptions } from "@rollup/plugin-inject";
import { createRequire } from "node:module";
import stdLibBrowser from "node-stdlib-browser";
import esbuildPlugin from "node-stdlib-browser/helpers/esbuild/plugin";
import { handleCircularDependancyWarning } from "node-stdlib-browser/helpers/rollup/plugin";
import type { Plugin } from "vite";

export type BuildTarget = "build" | "dev";
export type BooleanOrBuildTarget = boolean | "build" | "dev";
export type ModuleName = keyof typeof stdLibBrowser;
export type ModuleNameWithoutNodePrefix<T = ModuleName> = T extends `node:${infer P}` ? P : never;

const isTargetEnabled = (value: BooleanOrBuildTarget, target: BuildTarget) => {
  if (!value) {
    return false;
  }
  if (value === true) {
    return true;
  }

  return value === target;
};

const containsModuleName = (moduleNames: string[], moduleName) => {
  return moduleNames.some((name) => moduleName === name || `node:${moduleName}` === name);
};

export type NodePolyfillsOptions = {
  include: ModuleNameWithoutNodePrefix[];
  exclude: ModuleNameWithoutNodePrefix[];
  protocolImports: boolean;
  globals: {
    Buffer: BooleanOrBuildTarget;
    global: BooleanOrBuildTarget;
    process: BooleanOrBuildTarget;
  };
};

const globals = ["buffer", "global", "process"].flatMap((name) => [name, `node:${name}`]);

export const nodePolyfills = (options: Partial<NodePolyfillsOptions> = {}): Plugin => {
  const resolvedOptions: NodePolyfillsOptions = {
    include: [],
    exclude: [],
    protocolImports: true,
    ...options,
    globals: {
      Buffer: true,
      global: true,
      process: true,
      ...options.globals,
    },
  };

  const require = createRequire(import.meta.url);
  const esbuildShim = require.resolve("./shim");

  const polyfills = Object.entries(stdLibBrowser).reduce<Partial<Record<ModuleName, string>>>(
    (included, [name, value]) => {
      if (!resolvedOptions.protocolImports && name.startsWith("node:")) {
        return included;
      }

      if (
        resolvedOptions.include.length
          ? containsModuleName(resolvedOptions.include, name)
          : !containsModuleName(resolvedOptions.exclude, name)
      ) {
        included[name] = globals.includes(name) ? esbuildShim : value;
      }

      return included;
    },
    {}
  );

  return {
    name: "vite-plugin-node-polyfills",
    config: (_, env) => {
      const isDev = env.mode === "development";

      return {
        build: {
          rollupOptions: {
            onwarn: (warning, rollupWarn) => handleCircularDependancyWarning(warning, rollupWarn),
            plugins: [
              {
                ...inject(
                  globals.reduce<RollupInjectOptions>((buildOptions, lib) => {
                    if (isTargetEnabled(resolvedOptions.globals[lib], "build")) {
                      buildOptions[lib] = [esbuildShim, lib];
                    }

                    return buildOptions;
                  }, {})
                ),
                enforce: "post",
              },
            ],
          },
        },
        esbuild: {
          // In dev, the global polyfills need to be injected as a banner in order for isolated scripts (such as Vue SFCs) to have access to them.
          banner: globals
            .reduce((imports, lib) => {
              if (isDev && isTargetEnabled(resolvedOptions.globals[lib], "dev")) {
                imports.push(
                  `import { ${lib} as ${lib}Polyfill } from '${esbuildShim}'\nglobalThis.${lib} = ${lib}Polyfill`
                );
              }

              return imports;
            }, [])
            .join("\n"),
        },
        optimizeDeps: {
          esbuildOptions: {
            define: globals.reduce((esbuildOptions, lib) => {
              if (isTargetEnabled(resolvedOptions.globals[lib], "dev")) {
                esbuildOptions[lib] = { [lib]: lib };
              }

              return esbuildOptions;
            }, {}),
            inject: [esbuildShim],
            plugins: [
              esbuildPlugin(polyfills),
              // Supress the 'injected path "..." cannot be marked as external' error in Vite 4 (emitted by esbuild).
              // https://github.com/evanw/esbuild/blob/edede3c49ad6adddc6ea5b3c78c6ea7507e03020/internal/bundler/bundler.go#L1469
              {
                name: "vite-plugin-node-polyfills-shims-resolver",
                setup(build) {
                  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
                  const escapedGlobalShimsPath = esbuildShim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  const globalShimsFilter = new RegExp(`^${escapedGlobalShimsPath}$`);

                  // https://esbuild.github.io/plugins/#on-resolve
                  build.onResolve({ filter: globalShimsFilter }, () => {
                    return {
                      // https://github.com/evanw/esbuild/blob/edede3c49ad6adddc6ea5b3c78c6ea7507e03020/internal/bundler/bundler.go#L1468
                      external: false,
                      path: esbuildShim,
                    };
                  });
                },
              },
            ],
          },
        },
        resolve: {
          alias: polyfills,
        },
      };
    },
  };
};
