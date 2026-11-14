import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // @artisanpack-ui/react runs on the behavior engine; keep one React so the
    // components' hooks work here (as in packages/react's config).
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    server: {
      deps: {
        // Inline the behavior engine and Zag's React adapter so their react
        // imports go through `dedupe`.
        inline: [/@artisanpack-ui\/behavior\//, /@zag-js\/react\//],
      },
    },
  },
});
