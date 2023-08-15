import stdLibBrowser from "node-stdlib-browser";
import type { Plugin } from "vite";
export declare type BuildTarget = "build" | "dev";
export declare type BooleanOrBuildTarget = boolean | BuildTarget;
export declare type ModuleName = keyof typeof stdLibBrowser;
export declare type ModuleNameWithoutNodePrefix<T = ModuleName> = T extends `node:${infer P}` ? P : never;
export declare type PolyfillOptions = {
  /**
   * @example
   *
   * ```ts
   * nodePolyfills({
   *   include: ['fs', 'path'],
   * })
   * ```
   */
  include?: ModuleNameWithoutNodePrefix[];
  /**
   * @example
   *
   * ```ts
   * nodePolyfills({
   *   exclude: ['fs', 'path'],
   * })
   * ```
   */
  exclude?: ModuleNameWithoutNodePrefix[];
  /**
   * Specify whether specific globals should be polyfilled.
   *
   * @example
   *
   * ```ts
   * nodePolyfills({
   *   globals: {
   *     Buffer: false,
   *     global: true,
   *     process: 'build',
   *   },
   * })
   * ```
   */
  globals?: {
    Buffer?: BooleanOrBuildTarget;
    global?: BooleanOrBuildTarget;
    process?: BooleanOrBuildTarget;
  };
  /**
   * @default true
   */
  protocolImports?: boolean;
};
export declare type PolyfillOptionsResolved = {
  include: ModuleNameWithoutNodePrefix[];
  exclude: ModuleNameWithoutNodePrefix[];
  globals: {
    Buffer: BooleanOrBuildTarget;
    global: BooleanOrBuildTarget;
    process: BooleanOrBuildTarget;
  };
  protocolImports: boolean;
};
/**
 * Returns a Vite plugin to polyfill Node's Core Modules for browser environments. Supports `node:` protocol imports.
 *
 * @example
 *
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import { nodePolyfills } from 'vite-plugin-node-polyfills'
 *
 * export default defineConfig({
 *   plugins: [
 *     nodePolyfills({
 *       // Specific modules that should not be polyfilled.
 *       exclude: [],
 *       // Whether to polyfill specific globals.
 *       globals: {
 *         Buffer: true, // can also be 'build', 'dev', or false
 *         global: true,
 *         process: true,
 *       },
 *       // Whether to polyfill `node:` protocol imports.
 *       protocolImports: true,
 *     }),
 *   ],
 * })
 * ```
 */
export declare const nodePolyfills: (options?: PolyfillOptions) => Plugin;