/**
 * @module internal/icon
 *
 * Renders named icons from the design-system registry
 * (`@artisanpack-ui/behavior/icons`), so a name produces the same `<svg>` in
 * React as in Blade and Vue.
 *
 * @internal
 */

import {
  ICON_SVG_ATTRIBUTES,
  isDirectionalIcon as isRegisteredDirectional,
  resolveIcon,
} from '@artisanpack-ui/behavior/icons';
import type { ReactNode, SVGProps } from 'react';

import { devWarnOnce, hasContent } from './parts';

/**
 * The registry's svg attributes in React spelling (`stroke-width` →
 * `strokeWidth`), which React renders back to the identical DOM attributes.
 */
const SVG_PROPS = Object.fromEntries(
  Object.entries(ICON_SVG_ATTRIBUTES).map(([name, value]) => [
    name.startsWith('aria-')
      ? name
      : name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase()),
    value,
  ]),
) as SVGProps<SVGSVGElement>;

/**
 * Whether a named icon flips under RTL: the registry's directional names
 * (`DIRECTIONAL_ICONS` in `@artisanpack-ui/behavior/icons`, plus any an app
 * registers with `registerDirectionalIcons`).
 */
export function isDirectionalIcon(name: string | undefined): boolean {
  return isRegisteredDirectional(name);
}

/**
 * The `<svg>` for a registered icon name, or `null` (with a one-time
 * development warning) when the name isn't registered.
 */
export function IconSvg({
  name,
  dataIcon,
  ...extra
}: { name: string; dataIcon?: string } & SVGProps<SVGSVGElement> & {
    'data-scope'?: string;
    'data-part'?: string;
  }) {
  const body = resolveIcon(name);
  if (body === undefined) {
    devWarnOnce(`icon:${name}`, `Unknown icon "${name}". Register it with registerIcons().`);
    return null;
  }
  return (
    <svg
      {...SVG_PROPS}
      {...extra}
      data-icon={dataIcon}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

export interface IconPartProps {
  /** The component scope, such as `button`. */
  scope: string;
  /** The part name, such as `icon` or `iconEnd`. */
  part: string;
  /** A registered icon name. */
  name?: string;
  /** A node that overrides the name. */
  node?: ReactNode;
  /** Adds `data-mirror` for directional named icons. */
  mirror?: boolean;
  className?: string;
}

/** An icon part span, or `null` when there is neither a node nor a name. */
export function IconPart({ scope, part, name, node, mirror = false, className }: IconPartProps) {
  const hasNode = hasContent(node);
  if (!hasNode && !name) return null;
  return (
    <span
      className={className}
      data-scope={scope}
      data-part={part}
      aria-hidden="true"
      data-mirror={mirror && !hasNode && isDirectionalIcon(name) ? '' : undefined}
    >
      {hasNode ? node : <IconSvg name={name!} />}
    </span>
  );
}
