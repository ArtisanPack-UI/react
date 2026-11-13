/**
 * @module Toaster
 *
 * The toast region (#51) on the behavior engine's toast machines
 * (`useToaster`, `useToast`), and the default `toast` toaster. Toasts are
 * created from data, the same in every stack (D-019):
 *
 * ```tsx
 * <Toaster />
 * toast.create({ title: 'Listing archived', action: { label: 'Undo', onClick: restore } });
 * ```
 *
 * @packageDocumentation
 */

import {
  createToaster,
  TOAST_ICONS,
  type Toaster as ToasterInstance,
  type ToasterApi,
  type ToastEntry,
  useToast,
  useToaster,
} from '@artisanpack-ui/behavior/react';
import {
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, devWarnOnce, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Button } from '../../form/Button/Button';
import { TOAST_CLOSE_LABEL, ToastLayout, type ToastPart } from './Toast';

export type { ToastOptions, ToasterOptions } from '@artisanpack-ui/behavior/react';
export type { ToasterInstance };
export { createToaster };

/** Where a {@link Toaster}'s region sits. Logical: `start` and `end` follow the text direction. */
export type ToastPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end';

const DEFAULT_DURATION = 5000;

const base = createToaster();
let defaultDuration = DEFAULT_DURATION;

/**
 * The default toaster, which a {@link Toaster} without a `toaster` prop
 * renders. `toast.create({ title, description, color, action })` shows a
 * toast and returns its id; `toast.dismiss(id)` hides it.
 *
 * @example
 * ```tsx
 * toast.create({ title: 'Listing saved', color: 'success' });
 * ```
 */
export const toast: ToasterInstance = {
  store: base.store,
  // A new toast takes the Toaster's duration; reusing a shown toast's id patches
  // it, like update(), and keeps the duration it was created with.
  create: (options) =>
    options.id !== undefined && base.store.isVisible(options.id)
      ? base.create(options)
      : base.create({ ...options, duration: options.duration ?? defaultDuration }),
  // An update patches the toast; it never resets the duration it was created with.
  update: (id, options) => base.update(id, options),
  dismiss: (id) => base.dismiss(id),
  remove: (id) => base.remove(id),
};

type ToasterSettings = Pick<ToasterProps, 'placement' | 'max' | 'gap' | 'offsets' | 'duration'>;

/**
 * Applies a {@link Toaster}'s options and returns a function that restores
 * the previous ones. The region reads the store's options as it renders; the
 * default toaster also takes the duration its `create()` falls back to. Only
 * the options given change anything, so a Toaster without `duration` leaves
 * another's in place.
 */
function configureToaster(toaster: ToasterInstance, options: ToasterSettings): () => void {
  const { attrs } = toaster.store;
  const previous = {
    placement: attrs.placement,
    max: attrs.max,
    gap: attrs.gap,
    offsets: attrs.offsets,
    duration: defaultDuration,
  };
  if (options.placement !== undefined) attrs.placement = options.placement;
  if (options.max !== undefined) attrs.max = options.max;
  if (options.gap !== undefined) attrs.gap = options.gap;
  if (options.offsets !== undefined) attrs.offsets = options.offsets;
  const ownsDuration = toaster === toast && options.duration !== undefined;
  if (ownsDuration) defaultDuration = options.duration!;
  return () => {
    if (options.placement !== undefined) attrs.placement = previous.placement;
    if (options.max !== undefined) attrs.max = previous.max;
    if (options.gap !== undefined) attrs.gap = previous.gap;
    if (options.offsets !== undefined) attrs.offsets = previous.offsets;
    if (ownsDuration) defaultDuration = previous.duration;
  };
}

/*
 * One region per store: Zag keys a region by its placement, and two regions
 * rendering one store would show every toast twice. Toasters claim their
 * store in mount order; the first renders it and the others render nothing
 * until it unmounts.
 */
const claims = new Map<ToasterInstance['store'], symbol[]>();
const claimListeners = new Set<() => void>();

function notifyClaims(): void {
  for (const listener of claimListeners) listener();
}

function claimStore(store: ToasterInstance['store'], token: symbol): () => void {
  const tokens = claims.get(store) ?? [];
  if (tokens.length > 0) {
    devWarnOnce(
      'toaster:duplicate',
      'Only one <Toaster> renders a toaster; this one renders nothing while another is mounted. Render one per page, or give the second its own createToaster().',
    );
  }
  claims.set(store, [...tokens, token]);
  notifyClaims();
  return () => {
    const rest = (claims.get(store) ?? []).filter((item) => item !== token);
    if (rest.length) claims.set(store, rest);
    else claims.delete(store);
    notifyClaims();
  };
}

function subscribeClaims(listener: () => void): () => void {
  claimListeners.add(listener);
  return () => claimListeners.delete(listener);
}

/** Whether `token` holds `store`'s region: claimed first and still mounted. */
function useOwnsStore(store: ToasterInstance['store'], token: symbol): boolean {
  return useSyncExternalStore(
    subscribeClaims,
    () => claims.get(store)?.[0] === token,
    () => false,
  );
}

/** A layout effect on the client, a no-op on the server. */
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Props for the {@link Toaster} component. Native `<div>` attributes go to the region. */
export interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
  /** Where the region sits. @defaultValue `'bottom-end'` */
  placement?: ToastPlacement;
  /** At most this many show at once; the rest queue. @defaultValue `5` */
  max?: number;
  /** Space between toasts, in px. @defaultValue `8` */
  gap?: number;
  /**
   * Milliseconds before a toast dismisses itself, paused on hover and focus;
   * 0 keeps toasts. Applies to the default `toast`; a custom toaster takes it
   * from `createToaster()`. @defaultValue `5000`
   */
  duration?: number;
  /** Distance from the viewport edge. @defaultValue `'16px'` */
  offsets?: string;
  /**
   * The toaster to render, from `createToaster()`. Give a second toaster a
   * different `placement`: the region is keyed by its placement.
   * @defaultValue the default `toast`
   */
  toaster?: ToasterInstance;
  /** The region's accessible name. @defaultValue `'Notifications'` */
  label?: string;
  /** Each toast's close button's accessible name. Translate it for your locale. @defaultValue `'Dismiss notification'` */
  closeLabel?: string;
  /** Extra classes for each toast's parts. */
  classes?: PartClasses<ToastPart>;
}

function ToasterToast({
  entry,
  service,
  index,
  classes,
  closeLabel,
}: {
  entry: ToastEntry;
  service: ToasterApi['service'];
  index: number;
  classes: PartClasses<ToastPart>;
  closeLabel: string;
}) {
  const api = useToast(entry, service, index);
  const { meta } = api;
  const action = entry.action;
  return (
    <ToastLayout
      root={api.getRootProps()}
      icon={api.getIconProps()}
      iconContent={<IconSvg name={meta.icon ?? TOAST_ICONS[meta.color]} />}
      titleProps={api.getTitleProps()}
      title={api.title}
      descriptionProps={api.getDescriptionProps()}
      description={api.description}
      actionsProps={api.getActionsProps()}
      actions={
        action ? (
          <Button size="sm" variant="outline" color="neutral" {...api.getActionTriggerProps()}>
            {action.label}
          </Button>
        ) : null
      }
      closeTrigger={
        api.closable ? { ...api.getCloseTriggerProps(), 'aria-label': closeLabel } : undefined
      }
      classes={classes}
    />
  );
}

/**
 * The toast region: a labelled landmark at the end of the body that shows a
 * toaster's toasts, newest first, stacked and timed. Render one per page; a
 * second Toaster for the same toaster renders nothing (with a development
 * warning) while the first is mounted.
 *
 * @example
 * ```tsx
 * <Toaster />
 * <Button onClick={() => toast.create({ title: 'Listing saved', color: 'success' })}>Save</Button>
 * ```
 */
export function Toaster({ toaster = toast, ...props }: ToasterProps) {
  const [token] = useState(() => Symbol('toaster'));
  useClientLayoutEffect(() => claimStore(toaster.store, token), [toaster, token]);
  const owns = useOwnsStore(toaster.store, token);
  return owns ? <ToasterRegion toaster={toaster} {...props} /> : null;
}

/** The region of the Toaster that holds its store. */
function ToasterRegion({
  placement,
  max,
  gap,
  duration,
  offsets,
  toaster,
  label = 'Notifications',
  closeLabel = TOAST_CLOSE_LABEL,
  classes = {},
  className,
  ...rest
}: ToasterProps & { toaster: ToasterInstance }) {
  useClientLayoutEffect(
    () => configureToaster(toaster, { placement, max, gap, offsets, duration }),
    [toaster, placement, max, gap, offsets, duration],
  );

  const region = useToaster({ toaster });

  return (
    <Portal enabled>
      <div {...mergePartProps(rest, region.getGroupProps({ label }))} className={cx(className)}>
        {region.toasts.map((entry, index) => (
          <ToasterToast
            key={entry.id}
            entry={entry}
            service={region.service}
            index={index}
            classes={classes}
            closeLabel={closeLabel}
          />
        ))}
      </div>
    </Portal>
  );
}
