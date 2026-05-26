# @artisanpack-ui/react-laravel

## 1.0.1

### Patch Changes

- [#43](https://github.com/ArtisanPack-UI/react/pull/43) Import from narrow `@artisanpack-ui/react` subpaths in the adapter source ([#38](https://github.com/ArtisanPack-UI/react/issues/38)). `InertiaToastProvider`, `useFlashMessages`, `InertiaMenu`, `InertiaBreadcrumbs`, and `InertiaPagination` previously pulled the root barrel of `@artisanpack-ui/react`, which transitively dragged in the `Chart` component and its optional `react-apexcharts` peer. Apps doing subpath imports like `@artisanpack-ui/react-laravel/feedback` now stay clean — no more `Could not resolve "react-apexcharts"` build errors, and chart code is no longer pulled into bundles that don't use it.

### Updated dependencies

- `@artisanpack-ui/react@1.0.1`
- `@artisanpack-ui/tokens@1.0.1`

## 1.0.0

### Major Changes

- [`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial release

### Patch Changes

- Updated dependencies [[`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25)]:
  - @artisanpack-ui/tokens@1.0.0
  - @artisanpack-ui/react@1.0.0
