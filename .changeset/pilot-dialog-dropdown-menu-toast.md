---
'@artisanpack-ui/react': minor
---

Add `Dialog`, `DropdownMenu` (with `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator`), `Toast` and `Toaster` with the default `toast` toaster, built on the design system (ArtisanPack-UI/design-system#49 to #51). They render the shared markup contract (`.apui-dialog`, `.apui-dropdown-menu`, `.apui-toast`, `data-scope`/`data-part` parts) styled by `@artisanpack-ui/css`, and run on the behavior engine's machines (`@artisanpack-ui/behavior/react`), so focus, keyboard and ARIA match Livewire and Vue.

- `Dialog` and `DropdownMenu` take `open`/`defaultOpen` with `onOpenChange(open)`, and a `portal` prop (default on) that renders the overlay at the end of the body; with `portal={false}` they render in place and on the server.
- `DropdownMenu` reports `onSelect(value)` for action items and `onCheckedChange({ value, checked })` for checkbox and radio items, and its `items` prop renders the same markup as composition.
- `toast.create({ title, description, color, action })` shows a toast in a `<Toaster />`; `createToaster()` makes another toaster.
- Adds `@zag-js/react` as a dependency (the behavior engine's React adapter).

Deprecated, still exported and unchanged: `Modal` (use `Dialog`), `Dropdown` and `DropdownItem` (use `DropdownMenu`), and `ToastProvider`, `ToastMessage` and `useToast` (use `Toaster` and `toast`). They'll be removed in a later major release.
