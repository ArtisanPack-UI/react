/**
 * @module ThemeToggle
 *
 * The design-system ThemeToggle (#65): light, dark, high contrast or system.
 * A choice sets `data-theme` on the document (the attribute the tokens switch
 * on), persists in localStorage and follows the OS live while it's `system`,
 * through the theme helpers in `@artisanpack-ui/behavior`. Render
 * {@link ThemeScript} in `<head>` so the stored choice applies before first
 * paint.
 *
 * Segmented is a radio group on the segmented Tabs track; icon is one ghost
 * button that switches light and dark; menu is a DropdownMenu of radio items
 * on the same menu machine (`useDropdownMenu`, D-019).
 *
 * Uncontrolled, the toggle starts on the stored choice, else the one
 * ThemeScript applied (its `defaultValue`), else `defaultValue`, which it
 * applies only while `<html>` has no `data-theme`. Controlled, a pick only
 * calls `onValueChange`; the toggle applies, stores and passes on a value
 * when the parent changes `value` to it, never the one it mounts with.
 *
 * Inside a 2.x `ThemeProvider` the toggle keeps driving it: it starts
 * from the provider's `colorScheme`, calls `setColorScheme` on every pick and
 * follows the provider when something else sets it. The provider only knows
 * light, dark and system, so high contrast reaches it as `light` (the theme
 * high contrast is built on), and the provider's `light` leaves a high
 * contrast choice in place.
 *
 * @packageDocumentation
 */

import {
  applyTheme,
  directionOf,
  isThemeChoice,
  nextIconTheme,
  readThemeChoice,
  resolveTheme,
  startThemeChoice,
  THEME_ICONS,
  THEME_STORAGE_KEY,
  themeChoiceLabel,
  themeChoices,
  themeToggleKey,
  themeToggleLabels,
  watchTheme,
  type Theme,
  type ThemeChoice,
} from '@artisanpack-ui/behavior';
import { useDropdownMenu } from '@artisanpack-ui/behavior/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';

import { useOptionalTheme, type ColorScheme } from '../../../hooks/use-theme';
import { IconSvg } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Button } from '../../form/Button/Button';
import {
  DropdownMenuContext,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuContextValue,
  type RegisteredItem,
} from '../../layout/DropdownMenu/DropdownMenu';

export type { Theme, ThemeChoice } from '@artisanpack-ui/behavior';

/** What a 2.x ThemeProvider hears for a choice: high contrast is a light theme. */
function toColorScheme(choice: ThemeChoice): ColorScheme {
  return choice === 'high-contrast' ? 'light' : choice;
}

/** How the toggle shows the choices. */
export type ThemeToggleVariant = 'segmented' | 'icon' | 'menu';

/** The track's, the button's or the trigger's size. */
export type ThemeToggleSize = 'sm' | 'md';

/** The parts a {@link ThemeToggle} accepts extra classes for. */
export type ThemeTogglePart = 'root' | 'list' | 'option' | 'button' | 'trigger' | 'menu' | 'item';

/** Props for the {@link ThemeToggle} component. Native `<div>` attributes go to the root. */
export interface ThemeToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /**
   * The choice (controlled). Pair it with `onValueChange`: a pick only reports
   * the choice, and the toggle applies it once `value` changes to it.
   */
  value?: ThemeChoice;
  /** The choice an uncontrolled toggle shows when nothing is stored. @defaultValue `'system'` */
  defaultValue?: ThemeChoice;
  /** Called when the person picks another choice. Setting `value` doesn't call it. */
  onValueChange?: (value: ThemeChoice) => void;
  /** Emitted as `data-variant`. @defaultValue `'segmented'` */
  variant?: ThemeToggleVariant;
  /** Emitted as `data-size`. @defaultValue `'md'` */
  size?: ThemeToggleSize;
  /** The choices segmented and menu offer. @defaultValue all four */
  choices?: ThemeChoice[];
  /** Segmented shows only the icons; the names stay visually hidden. @defaultValue `false` */
  iconOnly?: boolean;
  /** Names the radio group and the menu; the menu trigger's text. Translate it. @defaultValue `'Theme'` */
  label?: string;
  /** @defaultValue `'Light'` */
  lightLabel?: string;
  /** @defaultValue `'Dark'` */
  darkLabel?: string;
  /** @defaultValue `'High contrast'` */
  highContrastLabel?: string;
  /** The system choice's name in the segmented control. @defaultValue `'System'` */
  systemLabel?: string;
  /** The system choice's name in the menu. @defaultValue `'Match system'` */
  matchSystemLabel?: string;
  /** The icon button's name while it switches to light. @defaultValue `'Switch to light theme'` */
  switchToLightLabel?: string;
  /** The icon button's name while it switches to dark. @defaultValue `'Switch to dark theme'` */
  switchToDarkLabel?: string;
  /** Stores the choice in localStorage. @defaultValue `true` */
  persist?: boolean;
  /** The localStorage key; pass the same one to ThemeScript. @defaultValue `'apui-theme'` */
  storageKey?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ThemeTogglePart>;
}

/**
 * Lets people choose light, dark, high contrast or system.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * <ThemeToggle variant="icon" size="sm" />
 * <ThemeToggle variant="menu" value={theme} onValueChange={setTheme} />
 * ```
 */
export const ThemeToggle = forwardRef<HTMLDivElement, ThemeToggleProps>(
  (
    {
      value,
      defaultValue = 'system',
      onValueChange,
      variant = 'segmented',
      size = 'md',
      choices,
      iconOnly = false,
      label,
      lightLabel,
      darkLabel,
      highContrastLabel,
      systemLabel,
      matchSystemLabel,
      switchToLightLabel,
      switchToDarkLabel,
      persist = true,
      storageKey = THEME_STORAGE_KEY,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const controlled = value !== undefined;
    const provider = useOptionalTheme();
    const providerRef = useRef(provider);
    const [own, setOwn] = useState<ThemeChoice>(() => {
      if (provider && isThemeChoice(provider.colorScheme)) return provider.colorScheme;
      return isThemeChoice(defaultValue) ? defaultValue : 'system';
    });
    // The OS scheme is unknown on the server, so the first render reads it as
    // light, and the effect corrects it.
    const [systemDark, setSystemDark] = useState(false);
    const current: ThemeChoice = controlled ? (isThemeChoice(value) ? value : 'system') : own;
    const currentRef = useRef(current);
    // Event handlers and watchers read the committed values.
    useEffect(() => {
      providerRef.current = provider;
      currentRef.current = current;
    });

    const resolved: Theme =
      current === 'system' ? (systemDark ? 'dark' : 'light') : (current as Theme);
    const offered = themeChoices(choices);
    const labels = themeToggleLabels({
      label,
      lightLabel,
      darkLabel,
      highContrastLabel,
      systemLabel,
      matchSystemLabel,
      switchToLightLabel,
      switchToDarkLabel,
    });

    useEffect(() => {
      setSystemDark(resolveTheme('system') === 'dark');
      if (!controlled) {
        const stored = persist ? readThemeChoice(storageKey) : null;
        if (stored) {
          setOwn(stored);
          providerRef.current?.setColorScheme(toColorScheme(stored));
        } else if (providerRef.current) {
          // Nothing stored: the provider's scheme is the choice, so show it.
          applyTheme(currentRef.current, { persist: false, broadcast: false });
        } else {
          // Nothing stored: what ThemeScript applied, else the default.
          setOwn(startThemeChoice(currentRef.current));
        }
      }
      // A controlled toggle shows its parent's value and an unpersisted one
      // ignores storage, so neither follows (or applies) another tab's choice.
      const followsStorage = persist && !controlled;
      return watchTheme(
        ({ value: next, source }) => {
          if (source === 'storage' && !followsStorage) return;
          if (next) {
            if (!controlled) {
              setOwn(next);
              providerRef.current?.setColorScheme(toColorScheme(next));
            }
            if (source === 'storage') applyTheme(next, { persist: false, broadcast: false });
          } else {
            setSystemDark(resolveTheme('system') === 'dark');
            if (currentRef.current === 'system') {
              applyTheme('system', { persist: false, broadcast: false });
            }
          }
        },
        { storageKey },
      );
      // Storage is read once per key; `controlled` and `persist` don't re-read it.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    // Something else set the provider's scheme: an uncontrolled toggle follows
    // it, unless it already means the same (high contrast under `light`).
    const providerScheme = provider?.colorScheme;
    const seenScheme = useRef(providerScheme);
    useEffect(() => {
      if (providerScheme === seenScheme.current) return;
      seenScheme.current = providerScheme;
      if (controlled || !isThemeChoice(providerScheme)) return;
      if (toColorScheme(currentRef.current) === providerScheme) return;
      setOwn(providerScheme);
      applyTheme(providerScheme, { persist, storageKey });
      // Only a change of the provider's scheme re-runs this.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerScheme]);

    // The parent changed a controlled value: apply, store and pass it on. The
    // value it mounts with isn't applied (ThemeScript did, or docs pages show
    // fixed values).
    const appliedValue = useRef(value);
    useEffect(() => {
      if (value === appliedValue.current) return;
      appliedValue.current = value;
      if (!controlled || !isThemeChoice(value)) return;
      applyTheme(value, { persist, storageKey });
      providerRef.current?.setColorScheme(toColorScheme(value));
      // Only a change of the value re-runs this.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const choose = useCallback(
      (next: unknown) => {
        if (!isThemeChoice(next)) return;
        const changed = next !== currentRef.current;
        if (controlled) {
          // The parent accepts it by changing `value`; the effect above applies it.
          if (changed) onValueChange?.(next);
          return;
        }
        setOwn(next);
        currentRef.current = next;
        applyTheme(next, { persist, storageKey });
        providerRef.current?.setColorScheme(toColorScheme(next));
        if (changed) onValueChange?.(next);
      },
      [controlled, persist, storageKey, onValueChange],
    );

    const rootProps = {
      ...rest,
      ref,
      className: cx(
        'apui-theme-toggle',
        variant === 'segmented' && 'apui-tabs',
        classes.root,
        className,
      ),
      'data-scope': 'theme-toggle',
      'data-part': 'root',
      'data-variant': variant,
      'data-size': size,
      'data-icon-only': flag(variant === 'segmented' && iconOnly),
      'data-value': current,
    };

    if (variant === 'icon') {
      const next = nextIconTheme(resolved);
      return (
        <div {...rootProps}>
          <Button
            variant="ghost"
            color="neutral"
            size={size}
            iconOnly
            className={classes.button}
            aria-label={next === 'light' ? labels.switchToLightLabel : labels.switchToDarkLabel}
            icon={<IconSvg name={next === 'light' ? 'sun' : 'moon'} />}
            onClick={() => choose(next)}
          />
        </div>
      );
    }

    if (variant === 'menu') {
      return (
        <div {...rootProps}>
          <ThemeMenu
            current={current}
            offered={offered}
            size={size}
            label={labels.label}
            itemLabel={(choice) => themeChoiceLabel(choice, labels, true)}
            classes={classes}
            onChoose={choose}
          />
        </div>
      );
    }

    const stop = offered.includes(current) ? current : offered[0];
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const focused = (event.target as Element)
        .closest('[role="radio"]')
        ?.getAttribute('data-value');
      const next = themeToggleKey(
        event.key,
        isThemeChoice(focused) ? focused : current,
        offered,
        directionOf(event.currentTarget as HTMLElement),
      );
      if (!next) return;
      event.preventDefault();
      choose(next);
      event.currentTarget
        .querySelector<HTMLElement>(`[role="radio"][data-value="${next}"]`)
        ?.focus();
    };

    return (
      <div {...rootProps}>
        <div
          data-scope="tabs"
          data-part="list"
          role="radiogroup"
          aria-label={labels.label}
          className={classes.list}
          onKeyDown={onKeyDown}
        >
          {offered.map((choice) => {
            const name = themeChoiceLabel(choice, labels);
            return (
              <button
                key={choice}
                type="button"
                data-scope="tabs"
                data-part="trigger"
                role="radio"
                data-value={choice}
                aria-checked={current === choice}
                tabIndex={stop === choice ? 0 : -1}
                className={classes.option}
                onClick={() => choose(choice)}
              >
                <span data-scope="tabs" data-part="icon" aria-hidden="true">
                  <IconSvg name={THEME_ICONS[choice]} />
                </span>
                {iconOnly ? <span className="apui-sr-only">{name}</span> : name}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

ThemeToggle.displayName = 'ThemeToggle';

interface ThemeMenuProps {
  current: ThemeChoice;
  offered: ThemeChoice[];
  size: ThemeToggleSize;
  label: string;
  itemLabel: (choice: ThemeChoice) => string;
  classes: PartClasses<ThemeTogglePart>;
  onChoose: (choice: ThemeChoice) => void;
}

/** The menu variant: an outline trigger showing the current choice's icon, and radio items. */
function ThemeMenu({
  current,
  offered,
  size,
  label,
  itemLabel,
  classes,
  onChoose,
}: ThemeMenuProps) {
  const registry = useRef(new Map<string, RegisteredItem>());
  const api = useDropdownMenu({ align: 'start' });
  const register = useCallback((value: string, item: RegisteredItem) => {
    registry.current.set(value, item);
    return () => {
      if (registry.current.get(value) === item) registry.current.delete(value);
    };
  }, []);
  const context: DropdownMenuContextValue = {
    api,
    classes: { item: classes.item },
    register,
    onCheckedChange: ({ value }) => onChoose(value as ThemeChoice),
  };

  return (
    <DropdownMenuContext.Provider value={context}>
      <Button
        {...api.getTriggerProps()}
        variant="outline"
        color="neutral"
        size={size}
        trailingIcon="chevron-down"
        icon={<IconSvg name={THEME_ICONS[current]} />}
        className={classes.trigger}
      >
        {label}
      </Button>
      <Portal enabled>
        <div {...api.getPositionerProps()}>
          <div
            {...api.getContentProps()}
            className={cx('apui-dropdown-menu', classes.menu)}
            data-surface="overlay"
            data-align="start"
          >
            {offered.map((choice, index) => (
              <ThemeMenuItem
                key={choice}
                choice={choice}
                separated={choice === 'system' && index > 0}
                checked={current === choice}
                label={itemLabel(choice)}
              />
            ))}
          </div>
        </div>
      </Portal>
    </DropdownMenuContext.Provider>
  );
}

function ThemeMenuItem({
  choice,
  separated,
  checked,
  label,
}: {
  choice: ThemeChoice;
  separated: boolean;
  checked: boolean;
  label: string;
}) {
  return (
    <>
      {separated ? <DropdownMenuSeparator /> : null}
      <DropdownMenuItem type="radio" value={choice} icon={THEME_ICONS[choice]} checked={checked}>
        {label}
      </DropdownMenuItem>
    </>
  );
}
