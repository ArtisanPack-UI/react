import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keep one React so hooks work in the design-system parity renders.
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    passWithNoTests: true,
    server: {
      deps: {
        // Inline the testing kit, the behavior engine and Zag's React adapter so
        // their react/react-dom imports go through `dedupe`, and so tests can spy
        // on behavior's exports (a native ES module namespace can't be spied on).
        // Run the manifest loader natively, since it locates its JSON with
        // `new URL(…, import.meta.url)`.
        inline: [/@artisanpack-ui\/(testing|behavior)\//, /@zag-js\/react\//],
        external: [/@artisanpack-ui\/manifest\//],
      },
    },
  },
});
