# Bundle Sizes

The `@artisanpack-ui/react` package ships tree-shakeable ESM entry points so you only pay for the components you import. Below are the bundle sizes for each entry point (measured from the built `dist/` output, excluding source maps).

## Per Entry Point

| Entry point    | Import path                        | Components |      Raw | Gzipped |
| -------------- | ---------------------------------- | ---------: | -------: | ------: |
| **form**       | `@artisanpack-ui/react/form`       |         14 |  51.6 KB |  8.9 KB |
| **layout**     | `@artisanpack-ui/react/layout`     |         10 |  40.8 KB |  8.5 KB |
| **navigation** | `@artisanpack-ui/react/navigation` |          7 |  25.9 KB |  6.2 KB |
| **data**       | `@artisanpack-ui/react/data`       |         11 |  60.2 KB | 13.7 KB |
| **chart**      | `@artisanpack-ui/react/chart`      |          1 |   4.3 KB |  1.7 KB |
| **feedback**   | `@artisanpack-ui/react/feedback`   |          6 |  10.5 KB |  2.8 KB |
| **utility**    | `@artisanpack-ui/react/utility`    |          5 |  15.2 KB |  4.7 KB |
| **all** (root) | `@artisanpack-ui/react`            |         56 | 204.0 KB | 44.3 KB |

> **Note:** The root entry point re-exports every component. Prefer category imports for smaller bundles.

## How to Measure

Build the package and inspect the `dist/` directory:

```bash
cd packages/react
npm run build
```

Entry point files (e.g. `form.mjs`) are thin re-export files. The actual code lives in shared chunks (`chunk-*.mjs`). The sizes above include each entry's re-export file plus all chunks it imports.

## Tips for Smaller Bundles

1. **Import from category entry points** instead of the root — only the chunks needed for that category are included.
2. **Chart is separate** — `@artisanpack-ui/react/chart` isolates the ApexCharts dependency so it is not pulled in by `@artisanpack-ui/react/data`.
3. **Peer dependencies are external** — `react`, `react-dom`, `apexcharts`, and `react-apexcharts` are not included in these sizes.
