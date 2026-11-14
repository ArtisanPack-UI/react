import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    navigation: 'src/navigation/index.ts',
    form: 'src/form/index.ts',
    layout: 'src/layout/index.ts',
    auth: 'src/auth/index.ts',
    feedback: 'src/feedback/index.ts',
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
  external: ['react', 'react-dom', '@inertiajs/react', '@artisanpack-ui/react', '@artisanpack-ui/tokens'],
  outExtension: () => ({ js: '.mjs' }),
});
