import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The design-system packages are linked from a sibling checkout with their
    // own node_modules; keep one React so hooks work in the parity renders.
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    passWithNoTests: true,
    server: {
      deps: {
        // The linked packages resolve outside node_modules. Inline the testing kit,
        // the behavior engine and Zag's React adapter (which the engine resolves from
        // the design-system checkout) so their react/react-dom imports go through
        // `dedupe`; run the manifest loader natively, since it locates its JSON with
        // `new URL(…, import.meta.url)`.
        inline: [/design-system\/packages\/(testing|behavior)\//, /@zag-js\/react\//],
        external: [/design-system\/packages\/manifest\//],
      },
    },
  },
});
