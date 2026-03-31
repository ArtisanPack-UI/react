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
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', '@inertiajs/react', '@artisanpack-ui/react', '@artisanpack-ui/tokens'],
  outExtension: () => ({ js: '.mjs' }),
});
