/**
 * @module Code
 *
 * The design-system Code (#65): read-only code, as a block with a header
 * (file name, language, copy) and optional line numbers and highlighted
 * lines, or inline. Renders the `.apui-code` markup contract styled by
 * `@artisanpack-ui/css`, with the lines from the behavior package's
 * `codeLines`, the same ones Blade and Vue render, separated by newlines so
 * the pre's text reads line by line. No syntax highlighting. The copy button
 * runs on `useClipboard`, as Clipboard does, and copies the exact source. The
 * code stays LTR (D-004).
 *
 * @packageDocumentation
 */

import {
  CLIPBOARD_LABELS,
  clipboardLabel,
  clipboardMessage,
  codeHighlights,
  codeLabel,
  codeLines,
} from '@artisanpack-ui/behavior';
import { useClipboard } from '@artisanpack-ui/behavior/react';
import { Fragment, forwardRef, useEffect, useMemo, useRef, type HTMLAttributes } from 'react';

import { IconPart } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The parts a {@link Code} accepts extra classes for. */
export type CodePart = 'root' | 'header' | 'file' | 'language' | 'copy' | 'status' | 'pre' | 'line';

/** Props for the {@link Code} component. Native attributes go to the root. */
export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** The code, shown as text. */
  code?: string;
  /** The language, shown as a badge in the header. Only a label: nothing is highlighted. */
  language?: string;
  /** The file name or a title, at the start of the header. */
  fileName?: string;
  /** Shows line numbers, which copying leaves out. @defaultValue `false` */
  numbered?: boolean;
  /** Line numbers to emphasize (1-based). */
  highlight?: number[];
  /** Inline code in running text: no header, numbers or copy. @defaultValue `false` */
  inline?: boolean;
  /** Shows the copy button. @defaultValue `true` */
  copyable?: boolean;
  /** Names the scroll region. Defaults to the file name, then the language, then "Code". */
  label?: string;
  /** The copy button's label; translate it. @defaultValue `'Copy'` */
  copyLabel?: string;
  /** The label after a copy; translate it. @defaultValue `'Copied'` */
  copiedLabel?: string;
  /** Announced after a copy; translate it. @defaultValue `'Copied to clipboard'` */
  copiedMessage?: string;
  /** Announced when the copy fails; translate it. */
  errorMessage?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CodePart>;
}

/**
 * Read-only code. The ref points at the root: the block's `<div>`, or the
 * inline `<code>`.
 *
 * @example
 * ```tsx
 * <Code code={snippet} fileName="format-price.ts" language="TypeScript" numbered highlight={[3]} />
 * <Code inline code="npm install" />
 * ```
 */
export const Code = forwardRef<HTMLElement, CodeProps>(
  (
    {
      code,
      language,
      fileName,
      numbered = false,
      highlight,
      inline = false,
      copyable = true,
      label,
      copyLabel = CLIPBOARD_LABELS.copy,
      copiedLabel = CLIPBOARD_LABELS.copied,
      copiedMessage = CLIPBOARD_LABELS.copiedMessage,
      errorMessage = CLIPBOARD_LABELS.errorMessage,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const clipboard = useClipboard();
    const lines = useMemo(() => codeLines(code), [code]);
    const highlighted = useMemo(() => codeHighlights(highlight), [highlight]);
    const { reset } = clipboard;
    const shownCode = useRef(code);
    // A new code clears a stale "Copied", even from a copy still in flight.
    useEffect(() => {
      if (shownCode.current === code) return;
      shownCode.current = code;
      reset();
    }, [code, reset]);

    if (inline) {
      return (
        <code
          {...rest}
          ref={ref}
          className={cx('apui-code', classes.root, className)}
          data-scope="code"
          data-part="root"
          data-inline=""
        >
          {code}
        </code>
      );
    }

    const labels = { copy: copyLabel, copied: copiedLabel, copiedMessage, errorMessage };
    const hasHeader = hasContent(fileName) || hasContent(language) || copyable;

    return (
      <div
        {...rest}
        ref={ref as never}
        className={cx('apui-code', classes.root, className)}
        data-scope="code"
        data-part="root"
        data-numbered={flag(numbered)}
      >
        {hasHeader ? (
          <div className={classes.header} data-scope="code" data-part="header">
            {hasContent(fileName) ? (
              <span className={classes.file} data-scope="code" data-part="file">
                {fileName}
              </span>
            ) : null}
            {hasContent(language) ? (
              <span
                className={cx('apui-badge', classes.language)}
                data-scope="code"
                data-part="language"
                data-color="neutral"
                data-variant="outline"
                data-size="sm"
              >
                {language}
              </span>
            ) : null}
            {copyable ? (
              <>
                <button
                  type="button"
                  className={cx('apui-button', classes.copy)}
                  data-scope="code"
                  data-part="copy"
                  data-variant="ghost"
                  data-color="neutral"
                  data-size="xs"
                  data-state={clipboard.status}
                  onClick={() => void clipboard.copy(code ?? '')}
                >
                  <IconPart
                    scope="button"
                    part="icon"
                    name={clipboard.status === 'copied' ? 'check' : 'copy'}
                  />
                  <span data-scope="button" data-part="label">
                    {clipboardLabel(clipboard.status, labels)}
                  </span>
                </button>
                <span
                  className={cx('apui-sr-only', classes.status)}
                  data-scope="code"
                  data-part="status"
                  role="status"
                >
                  {clipboardMessage(clipboard.status, labels)}
                </span>
              </>
            ) : null}
          </div>
        ) : null}
        <pre
          className={classes.pre}
          data-scope="code"
          data-part="pre"
          role="region"
          aria-label={codeLabel(label, fileName, language)}
          tabIndex={0}
        >
          <code>
            {lines.map((line, index) => (
              <Fragment key={index}>
                {index > 0 ? '\n' : null}
                <span
                  className={classes.line}
                  data-scope="code"
                  data-part="line"
                  data-n={index + 1}
                  data-highlight={flag(highlighted.has(index + 1))}
                >
                  {line}
                </span>
              </Fragment>
            ))}
          </code>
        </pre>
      </div>
    );
  },
);

Code.displayName = 'Code';
