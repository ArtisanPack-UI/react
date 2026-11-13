/**
 * @module Spotlight
 *
 * The design-system Spotlight (#57): a command palette on the behavior
 * engine's dialog and combobox machines (`useSpotlight`), rendering the
 * `.apui-spotlight` markup contract styled by `@artisanpack-ui/css`. The
 * panel carries the root class and is the dialog's `content` part (D-019).
 * Replaces SpotlightSearch.
 *
 * @packageDocumentation
 */

import {
  highlightLabel,
  type SpotlightEntry,
  type SpotlightGroup,
  type SpotlightItem,
  useSpotlight,
} from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { safeHref } from '../../../internal/url';
import { Button } from '../../form/Button/Button';

export type { SpotlightGroup } from '@artisanpack-ui/behavior/react';

/**
 * One result in a {@link SpotlightGroup}: `label`, and optionally `value`,
 * `description`, `href`, `icon`, `color`, `shortcut`, `keywords` and
 * `disabled`. Named `SpotlightResult` because `SpotlightItem` stays the
 * deprecated SpotlightSearch's item type.
 */
export type SpotlightResult = SpotlightItem;

/** The parts a {@link Spotlight} accepts extra classes for. `root` is the panel. */
export type SpotlightPart =
  | 'root'
  | 'trigger'
  | 'backdrop'
  | 'positioner'
  | 'search'
  | 'icon'
  | 'query'
  | 'closeTrigger'
  | 'results'
  | 'itemGroup'
  | 'itemGroupLabel'
  | 'item'
  | 'tile'
  | 'itemText'
  | 'itemDescription'
  | 'shortcut'
  | 'itemIndicator'
  | 'empty'
  | 'loading'
  | 'footer';

/** Props for the {@link Spotlight} component. Native `<div>` attributes go to the panel. */
export interface SpotlightProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Whether it's open (controlled). Pair it with `onOpenChange`. Emitted as `data-state` on every part. */
  open?: boolean;
  /** The initial state of an uncontrolled palette. @defaultValue `false` */
  defaultOpen?: boolean;
  /**
   * Called when the palette opens or closes itself: the trigger, the shortcut,
   * Escape, the backdrop, the Esc button or a choice. Setting `open` doesn't call it.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The results, in groups. Each item takes `label`, and optionally `value`
   * (defaults to `href`, then `label`), `description`, `href`, `icon`,
   * `color`, `shortcut`, `keywords` and `disabled`. Unless `remote`, items are
   * filtered as the user types, by every word.
   */
  groups?: SpotlightGroup[];
  /** The query text (controlled). Pair it with `onSearchChange`. */
  search?: string;
  /** Called with the query as the user types, and with `''` when the palette closes. */
  onSearchChange?: (search: string) => void;
  /** Called when an item is chosen, by click or Enter. A link item is followed too. */
  onSelect?: (item: SpotlightResult & { value: string }) => void;
  /** The page searches: `groups` are the results for `search` and aren't filtered here. @defaultValue `false` */
  remote?: boolean;
  /** Shows the loading row and marks the results busy. @defaultValue `false` */
  loading?: boolean;
  /**
   * The global shortcut: modifiers and a key joined with `+`. `mod` is ⌘ on
   * Apple platforms and Ctrl elsewhere. Empty turns it off. @defaultValue `'mod+k'`
   */
  shortcut?: string;
  /**
   * Lists recent choices first, in a Recent group, while the query is empty.
   * Off by default: they're kept in the browser's localStorage. @defaultValue `false`
   */
  recent?: boolean;
  /** The palette's accessible name. Translate it. @defaultValue `'Search'` */
  label?: string;
  /** The query's placeholder. Translate it. @defaultValue `'Search…'` */
  placeholder?: string;
  /** Shown when nothing matches; a node replaces the text. Translate it. @defaultValue `'No results.'` */
  emptyLabel?: ReactNode;
  /** Shown while loading. Translate it. @defaultValue `'Searching…'` */
  loadingLabel?: string;
  /** The Recent group's label. Translate it. @defaultValue `'Recent'` */
  recentLabel?: string;
  /** The Esc button's accessible name. Translate it. @defaultValue `'Close'` */
  closeLabel?: string;
  /** The footer's hint beside the arrow keys. Translate it. @defaultValue `'Navigate'` */
  navigateLabel?: string;
  /** The footer's hint beside the Enter key. Translate it. @defaultValue `'Open'` */
  selectLabel?: string;
  /** Content for a trigger button that opens the palette, shown with the shortcut's keys. */
  trigger?: ReactNode;
  /** Replaces the footer's key hints. */
  footer?: ReactNode;
  /** Traps focus, locks scroll and hides the page from assistive technology. Sets `aria-modal`. @defaultValue `true` */
  modal?: boolean;
  /** Renders the palette at the end of the body (a React portal). Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part; `classes.root` (the panel) merges with `className`. */
  classes?: PartClasses<SpotlightPart>;
}

/** Keys as a hint: one `<kbd>` each. */
function Keys({ keys, className }: { keys: string[]; className?: string }) {
  if (!keys.length) return null;
  return (
    <span className={className} data-scope="spotlight" data-part="shortcut" aria-hidden="true">
      {keys.map((key, index) => (
        <kbd key={`${key}-${index}`}>{key}</kbd>
      ))}
    </span>
  );
}

/** An item's display shortcut as keys. */
const itemKeys = (shortcut: SpotlightResult['shortcut']): string[] =>
  Array.isArray(shortcut)
    ? shortcut.filter(Boolean)
    : shortcut
      ? shortcut.split(/\s+|\+(?!$)/).filter(Boolean)
      : [];

/**
 * A command palette: search across pages, records and actions. ⌘K (Ctrl+K
 * elsewhere) toggles it; the arrow keys move, Enter opens, Escape closes. The
 * ref points at the panel, which renders (hidden) while the palette is closed.
 *
 * @example
 * ```tsx
 * <Spotlight trigger="Search" groups={[{ label: 'Pages', items: [{ label: 'Reports', href: '/reports' }] }]} />
 * ```
 */
export const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      groups = [],
      search,
      onSearchChange,
      onSelect,
      remote = false,
      loading = false,
      shortcut = 'mod+k',
      recent = false,
      label = 'Search',
      placeholder = 'Search…',
      emptyLabel = 'No results.',
      loadingLabel = 'Searching…',
      recentLabel = 'Recent',
      closeLabel = 'Close',
      navigateLabel = 'Navigate',
      selectLabel = 'Open',
      trigger,
      footer,
      modal = true,
      portal = true,
      classes = {},
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const api = useSpotlight({
      id,
      groups,
      open,
      defaultOpen,
      onOpenChange,
      search,
      onSearchChange,
      onSelect,
      remote,
      loading,
      modal,
      label,
      shortcut,
      recent,
      recentLabel,
      translations: {
        noResults: typeof emptyLabel === 'string' ? emptyLabel : undefined,
        loading: loadingLabel,
      },
    });

    const renderItem = (item: SpotlightEntry) => {
      const content = (
        <>
          {item.icon ? (
            <span
              className={classes.tile}
              data-scope="spotlight"
              data-part="tile"
              aria-hidden="true"
            >
              <IconSvg name={item.icon} />
            </span>
          ) : null}
          <span {...api.getItemTextProps({ item })} className={classes.itemText}>
            {highlightLabel(item.label, api.query).map((segment, index) =>
              segment.match ? <mark key={index}>{segment.text}</mark> : segment.text,
            )}
            {item.description ? (
              <span
                className={classes.itemDescription}
                data-scope="spotlight"
                data-part="item-description"
              >
                {item.description}
              </span>
            ) : null}
          </span>
          <Keys keys={itemKeys(item.shortcut)} className={classes.shortcut} />
          <span
            className={classes.itemIndicator}
            data-scope="spotlight"
            data-part="item-indicator"
            aria-hidden="true"
          >
            <IconSvg name="corner-down-left" />
          </span>
        </>
      );
      const props = {
        ...api.getItemProps({ item }),
        className: classes.item,
        'data-color': item.color,
      };
      // Only relative, http(s), mailto, tel and sms links; anything else renders a plain option.
      const href = safeHref(item.href);
      return href ? (
        <a key={item.value} href={href} {...props}>
          {content}
        </a>
      ) : (
        <div key={item.value} {...props}>
          {content}
        </div>
      );
    };

    return (
      <>
        {hasContent(trigger) ? (
          <Button
            {...api.getTriggerProps()}
            variant="outline"
            color="neutral"
            aria-keyshortcuts={api.ariaKeyShortcuts}
            className={classes.trigger}
          >
            {trigger}
            <Keys keys={api.shortcutKeys} className={classes.shortcut} />
          </Button>
        ) : null}
        <Portal enabled={portal}>
          <div {...api.getBackdropProps()} className={classes.backdrop} />
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-spotlight', classes.root, className)}
            >
              <div {...api.getSearchProps()} className={classes.search}>
                <span
                  className={classes.icon}
                  data-scope="spotlight"
                  data-part="icon"
                  aria-hidden="true"
                >
                  <IconSvg name="search" />
                </span>
                <input
                  {...api.getQueryProps()}
                  className={classes.query}
                  aria-label={label}
                  placeholder={placeholder}
                  aria-keyshortcuts={api.ariaKeyShortcuts}
                />
                <button
                  {...api.getCloseTriggerProps()}
                  type="button"
                  className={classes.closeTrigger}
                  aria-label={`Esc, ${closeLabel}`}
                  aria-keyshortcuts="Escape"
                >
                  Esc
                </button>
              </div>
              <div {...api.getResultsProps()} className={classes.results} aria-label={label}>
                {api.groups.map((group) => (
                  <div
                    key={group.id}
                    {...api.getItemGroupProps({ id: group.id })}
                    aria-labelledby={
                      group.label
                        ? (api.getItemGroupProps({ id: group.id })['aria-labelledby'] as string)
                        : undefined
                    }
                    className={classes.itemGroup}
                  >
                    {group.label ? (
                      <div
                        {...api.getItemGroupLabelProps({ htmlFor: group.id })}
                        className={classes.itemGroupLabel}
                      >
                        {group.label}
                      </div>
                    ) : null}
                    {group.items.map(renderItem)}
                  </div>
                ))}
                <div {...api.getEmptyProps()} className={classes.empty}>
                  {emptyLabel}
                </div>
                <div {...api.getLoadingProps()} className={classes.loading}>
                  {loadingLabel}
                </div>
              </div>
              <div className={classes.footer} data-scope="spotlight" data-part="footer">
                {hasContent(footer) ? (
                  footer
                ) : (
                  <>
                    <span>
                      <Keys keys={['↑', '↓']} className={classes.shortcut} />
                      {navigateLabel}
                    </span>
                    <span>
                      <Keys keys={['↵']} className={classes.shortcut} />
                      {selectLabel}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Portal>
      </>
    );
  },
);

Spotlight.displayName = 'Spotlight';
