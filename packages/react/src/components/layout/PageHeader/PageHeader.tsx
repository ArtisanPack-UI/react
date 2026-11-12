/**
 * @module PageHeader
 *
 * The design-system PageHeader (#58): the title block at the top of a page.
 * Breadcrumbs, then a row holding the meta, title and description beside
 * the actions, then tabs. Renders the `.apui-page-header` markup contract
 * styled by `@artisanpack-ui/css`; parts are scoped `page-header`. The
 * title is the page's `h1` unless `level` says otherwise.
 *
 * @packageDocumentation
 */

import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** The parts a {@link PageHeader} accepts extra classes for. */
export type PageHeaderPart =
  | 'root'
  | 'breadcrumbs'
  | 'row'
  | 'meta'
  | 'title'
  | 'description'
  | 'actions'
  | 'tabs';

/** Props for the {@link PageHeader} component. Native `<div>` attributes go to the root. */
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The page's title. */
  title?: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** The title's heading level, 1 to 6. @defaultValue `1` */
  level?: number;
  /** Breadcrumbs above the title. */
  breadcrumbs?: ReactNode;
  /** Status above the title, such as a badge. */
  meta?: ReactNode;
  /** Buttons at the inline end of the title row, the primary one last. */
  actions?: ReactNode;
  /** Tabs under the title row. */
  tabs?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<PageHeaderPart>;
}

/**
 * The title block at the top of a page.
 *
 * @example
 * ```tsx
 * <PageHeader title="Dashboard" description="Income and profit." actions={<Button>Share</Button>} />
 * ```
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      description,
      level = 1,
      breadcrumbs,
      meta,
      actions,
      tabs,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const heading = `h${Math.min(6, Math.max(1, Math.round(Number(level) || 1)))}`;
    return (
      <div {...rest} ref={ref} className={cx('apui-page-header', classes.root, className)}>
        {hasContent(breadcrumbs) ? (
          <div data-scope="page-header" data-part="breadcrumbs" className={classes.breadcrumbs}>
            {breadcrumbs}
          </div>
        ) : null}
        <div data-scope="page-header" data-part="row" className={classes.row}>
          <div>
            {hasContent(meta) ? (
              <div data-scope="page-header" data-part="meta" className={classes.meta}>
                {meta}
              </div>
            ) : null}
            {hasContent(title)
              ? createElement(
                  heading,
                  { 'data-scope': 'page-header', 'data-part': 'title', className: classes.title },
                  title,
                )
              : null}
            {hasContent(description) ? (
              <p data-scope="page-header" data-part="description" className={classes.description}>
                {description}
              </p>
            ) : null}
          </div>
          {hasContent(actions) ? (
            <div data-scope="page-header" data-part="actions" className={classes.actions}>
              {actions}
            </div>
          ) : null}
        </div>
        {hasContent(tabs) ? (
          <div data-scope="page-header" data-part="tabs" className={classes.tabs}>
            {tabs}
          </div>
        ) : null}
      </div>
    );
  },
);

PageHeader.displayName = 'PageHeader';
