import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // @artisanpack-ui/react runs on the behavior engine, linked from a sibling
    // design-system checkout with its own node_modules; keep one React so the
    // components' hooks work here (as in packages/react's config).
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    server: {
      deps: {
        // Inline the behavior engine and Zag's React adapter (which the engine
        // resolves from the design-system checkout) so their react imports go
        // through `dedupe`.
        inline: [/design-system\/packages\/behavior\//, /@zag-js\/react\//],
      },
    },
  },
});
