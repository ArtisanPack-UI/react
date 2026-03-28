import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tailwind-plugin': 'src/tailwind-plugin.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  outExtension: () => ({ js: '.mjs' }),
  onSuccess: async () => {
    // Copy CSS file to dist
    const { copyFileSync, mkdirSync, existsSync } = await import('fs');
    const { resolve } = await import('path');

    const distDir = resolve('dist');
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    copyFileSync(resolve('src/css/tokens.css'), resolve('dist/tokens.css'));
    console.log('Copied tokens.css to dist/');
  },
});
