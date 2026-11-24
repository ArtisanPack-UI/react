---
'@artisanpack-ui/react': minor
'@artisanpack-ui/react-laravel': minor
---

Fill the gaps the ecommerce React ports need from the Table and the Laravel helpers.

- `Table` takes `rowLabel(row)` to name each row in the select and expand labels, such as "Select order #1048".
- `PaginatorLink` has the optional `page` number Laravel 12.23+ sends.
- New `LaravelSimplePaginator`, `LaravelCursorPaginator` and `LaravelResourcePaginator` types for `simplePaginate()`, `cursorPaginate()` and paginated API resource collections. `current_page_url` on the simple paginator is optional, since Laravel only sends it from 12.15.
- `InertiaPagination` accepts a paginated API resource collection (page details under `meta`), and `preserveQuery` keeps the current URL's search, filter and sort parameters when changing page.
