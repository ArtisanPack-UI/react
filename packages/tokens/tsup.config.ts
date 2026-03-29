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
    // Copy CSS file to dist, using import.meta.url for reliable path resolution
    const { copyFileSync, mkdirSync } = await import('fs');
    const { dirname, resolve } = await import('path');
    const { fileURLToPath } = await import('url');

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const distDir = resolve(__dirname, 'dist');
    mkdirSync(distDir, { recursive: true });

    copyFileSync(resolve(__dirname, 'src/css/tokens.css'), resolve(distDir, 'tokens.css'));
    console.log('Copied tokens.css to dist/');
  },
});
