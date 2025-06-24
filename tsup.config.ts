import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/engine.ts', 'src/plugin.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
]);
