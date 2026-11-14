import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    form: 'src/components/form/index.ts',
    layout: 'src/components/layout/index.ts',
    navigation: 'src/components/navigation/index.ts',
    data: 'src/components/data/index.ts',
    chart: 'src/components/data/Chart/Chart.tsx',
    feedback: 'src/components/feedback/index.ts',
    utility: 'src/components/utility/index.ts',
    ai: 'src/components/ai/index.ts',
  },
  format: ['esm'],
  // The components use hooks and browser APIs, so every module is a client
  // module for React Server Components (Next.js App Router). esbuild adds the
  // banner after bundling, as the first line of each entry and chunk, and keeps
  // the source maps in step.
  banner: { js: "'use client';" },
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  outExtension: () => ({ js: '.mjs' }),
});
