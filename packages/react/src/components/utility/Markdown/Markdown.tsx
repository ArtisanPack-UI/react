/**
 * @module Markdown
 *
 * The design-system Markdown (#65): GitHub-flavored Markdown in the shared
 * `.apui-prose` styles, rendering the `.apui-markdown` markup contract from
 * `@artisanpack-ui/css`. The HTML comes from the behavior package's
 * `renderMarkdown`, the same HTML Livewire writes with league/commonmark:
 * raw HTML is escaped (or, with `sanitize={false}`, filtered to formatting
 * tags) and unsafe link and image URLs are dropped. `mode="write"` or
 * `"split"` adds Write, Preview and Split tabs over a Textarea.
 *
 * @packageDocumentation
 */

import { MARKDOWN_LABELS, renderMarkdown, type MarkdownMode } from '@artisanpack-ui/behavior';
import { forwardRef, useMemo, useState, type HTMLAttributes } from 'react';

import { cx, type PartClasses } from '../../../internal/parts';
import { Textarea } from '../../form/Textarea/Textarea';
import { Tabs } from '../../layout/Tabs/Tabs';

export type { MarkdownMode };

/** The parts a {@link Markdown} accepts extra classes for. */
export type MarkdownPart = 'root' | 'editor' | 'preview' | 'split';

/** Props for the {@link Markdown} component. Native `<div>` attributes go to the root. */
export interface MarkdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> {
  /** The Markdown. In write and split modes, the Textarea's value. */
  source?: string;
  /** Called with the new source as it's edited. Without it the editor keeps its own draft. */
  onSourceChange?: (source: string) => void;
  /**
   * `preview` renders the Markdown only; `write` and `split` add Write,
   * Preview and Split tabs over the source, opening on that tab. Emitted as
   * `data-mode`. @defaultValue `'preview'`
   */
  mode?: MarkdownMode;
  /**
   * Escape raw HTML (the default). `false` keeps the allowlisted formatting
   * tags with safe attributes and escapes every other tag; script-capable
   * markup never renders. @defaultValue `true`
   */
  sanitize?: boolean;
  /** Names the mode tabs; translate it. @defaultValue `'Markdown mode'` */
  tabsLabel?: string;
  /** The Write tab; translate it. @defaultValue `'Write'` */
  writeLabel?: string;
  /** The Preview tab; translate it. @defaultValue `'Preview'` */
  previewLabel?: string;
  /** The Split tab; translate it. @defaultValue `'Split'` */
  splitLabel?: string;
  /** Names the source Textarea; translate it. @defaultValue `'Markdown source'` */
  editorLabel?: string;
  /** Names the preview region in write and split modes; translate it. @defaultValue `'Rendered preview'` */
  outputLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<MarkdownPart>;
}

/**
 * Renders Markdown, and optionally edits it.
 *
 * @example
 * ```tsx
 * <Markdown source={notes} />
 * <Markdown source={notes} onSourceChange={setNotes} mode="split" />
 * ```
 */
export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  (
    {
      source = '',
      onSourceChange,
      mode = 'preview',
      sanitize = true,
      tabsLabel = MARKDOWN_LABELS.tabs,
      writeLabel = MARKDOWN_LABELS.write,
      previewLabel = MARKDOWN_LABELS.preview,
      splitLabel = MARKDOWN_LABELS.split,
      editorLabel = MARKDOWN_LABELS.editor,
      outputLabel = MARKDOWN_LABELS.output,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const editing = mode === 'write' || mode === 'split';
    const [draft, setDraft] = useState(source);
    const [view, setView] = useState<MarkdownMode>(mode);
    // A new source or mode from the parent replaces the draft or the tab.
    const [synced, setSynced] = useState({ source, mode });
    if (synced.source !== source || synced.mode !== mode) {
      setSynced({ source, mode });
      if (synced.source !== source) setDraft(source);
      if (synced.mode !== mode) setView(mode);
    }

    const text = editing ? draft : source;
    const html = useMemo(() => renderMarkdown(text, { sanitize }), [text, sanitize]);

    if (!editing) {
      return (
        <div
          {...rest}
          ref={ref}
          className={cx('apui-markdown', 'apui-prose', classes.root, className)}
          data-mode="preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    const change = (next: string) => {
      setDraft(next);
      onSourceChange?.(next);
    };

    const editor = (
      <div data-scope="markdown" data-part="editor" className={classes.editor}>
        <Textarea
          aria-label={editorLabel}
          dir="auto"
          value={draft}
          onValueChange={change}
          rows={12}
        />
      </div>
    );

    const preview = (
      <div
        data-scope="markdown"
        data-part="preview"
        role="region"
        aria-label={outputLabel}
        className={cx('apui-prose', classes.preview)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );

    // Only the selected tab's panel holds content, so the source has one Textarea.
    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-markdown', classes.root, className)}
        data-mode={mode}
      >
        <Tabs
          size="sm"
          label={tabsLabel}
          value={view}
          onValueChange={(next) => setView(next as MarkdownMode)}
          tabs={[
            { value: 'write', label: writeLabel, content: view === 'write' ? editor : null },
            { value: 'preview', label: previewLabel, content: view === 'preview' ? preview : null },
            {
              value: 'split',
              label: splitLabel,
              content:
                view === 'split' ? (
                  <div data-scope="markdown" data-part="split" className={classes.split}>
                    {editor}
                    {preview}
                  </div>
                ) : null,
            },
          ]}
        />
      </div>
    );
  },
);

Markdown.displayName = 'Markdown';
