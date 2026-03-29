import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    form: 'src/components/form/index.ts',
    layout: 'src/components/layout/index.ts',
    navigation: 'src/components/navigation/index.ts',
    display: 'src/components/display/index.ts',
    data: 'src/components/data/index.ts',
    chart: 'src/components/data/Chart/Chart.tsx',
    feedback: 'src/components/feedback/index.ts',
    utility: 'src/components/utility/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'apexcharts', 'react-apexcharts'],
  outExtension: () => ({ js: '.mjs' }),
});
