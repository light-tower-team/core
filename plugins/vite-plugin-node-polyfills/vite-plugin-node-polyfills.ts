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

const globals = ["Buffer", "global", "process"].flatMap((name) => [name, `node:${name}`]);

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
  const esbuildShim = require.resolve("node-stdlib-browser/helpers/esbuild/shim");

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
        included[name] = value;
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
            // https://github.com/niksy/node-stdlib-browser#rollup
            onwarn: (warning, rollupWarn) => handleCircularDependancyWarning(warning, rollupWarn),
            // https://github.com/niksy/node-stdlib-browser#rollup
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
            // https://github.com/niksy/node-stdlib-browser#esbuild
            define: globals.reduce((esbuildOptions, lib) => {
              if (isTargetEnabled(resolvedOptions.globals[lib], "dev")) {
                esbuildOptions[lib] = lib;
              }

              return esbuildOptions;
            }, {}),
            // https://github.com/niksy/node-stdlib-browser#esbuild
            inject: [esbuildShim],
            // https://github.com/niksy/node-stdlib-browser#esbuild
            plugins: [esbuildPlugin(polyfills)],
          },
        },
        resolve: {
          alias: polyfills,
        },
      };
    },
  };
};
