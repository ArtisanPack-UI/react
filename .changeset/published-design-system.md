---
'@artisanpack-ui/react': patch
'@artisanpack-ui/react-laravel': patch
---

Depend on the published design-system packages: `@artisanpack-ui/react` now installs `@artisanpack-ui/behavior` 1.x from npm, and neither package depends on `@artisanpack-ui/tokens` any more (nothing imports it since the move off DaisyUI). `@artisanpack-ui/react-laravel` now requires a matching `@artisanpack-ui/react` instead of any version.
