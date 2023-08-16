/* eslint-disable no-undef */
import { Buffer } from "buffer-polyfill";
import { default as process } from "process-polyfill";

const _global = globalThis || this || self;

export { Buffer, process, _global as global };
