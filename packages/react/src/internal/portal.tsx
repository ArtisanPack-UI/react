/**
 * @module internal/portal
 *
 * Renders overlay parts at the end of `document.body` (the `portal` prop of
 * Dialog, DropdownMenu and Toaster, D-019), or in place when it's off.
 *
 * A portal needs the DOM, so with `portal` on the parts render only on the
 * client, after mount: the server (and the first client render, so hydration
 * matches) renders nothing there. With `portal` off they render in place on
 * both, which is how the gates and the parity checks render overlays.
 *
 * @internal
 */

import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const subscribe = () => () => {};

/** `false` on the server and while hydrating, `true` on the client after. */
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export interface PortalProps {
  /** Portal to the body. Off renders the children in place. */
  enabled: boolean;
  children: ReactNode;
}

/** The children, portalled to `document.body` on the client, or in place. */
export function Portal({ enabled, children }: PortalProps) {
  const isClient = useIsClient();
  if (!enabled) return <>{children}</>;
  if (!isClient) return null;
  return createPortal(children, document.body);
}
