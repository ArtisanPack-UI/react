---
'@artisanpack-ui/react': major
'@artisanpack-ui/react-laravel': major
---

2.0 rebuilds the library on the ArtisanPack UI design system. Components render the shared `.apui-*` markup, styled by `@artisanpack-ui/css`, with interaction from the `@artisanpack-ui/behavior` engine, so they match Livewire UI Components 3.0 and `@artisanpack-ui/vue` 2.0 prop for prop. DaisyUI is no longer used or needed, and Tailwind is optional. The 1.x components that were renamed keep working as deprecated aliases until the next major. See the upgrade guide at https://docs.artisanpackui.dev/documentation/react/upgrading, or run the `@artisanpack-ui/codemods` upgrade tool.
