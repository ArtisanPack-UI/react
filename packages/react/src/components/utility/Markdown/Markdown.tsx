/**
 * @module Markdown
 *
 * Renders a markdown string as HTML inside a `prose`-styled container.
 * Ships with a minimal built-in parser that handles common constructs
 * (headings, bold, italic, inline code, links, lists, blockquotes,
 * horizontal rules, and paragraphs). For richer rendering, supply a
 * custom `renderMarkdown` function backed by a library such as `marked`
 * or `remark`.
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Markdown} component.
 */
export interface MarkdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> {
  /** Raw markdown source text to render. */
  source: string;
  /**
   * Custom render function that receives the raw markdown source and
   * returns an HTML string. When omitted a minimal built-in parser is used.
   *
   * **Security:** The returned string is injected via `dangerouslySetInnerHTML`.
   * It must be produced by a trusted source or explicitly sanitized to prevent XSS.
   */
  renderMarkdown?: (source: string) => string;
}

/**
 * Minimal built-in markdown-to-HTML converter.
 * Covers the most common markdown constructs — for richer rendering provide a
 * custom `renderMarkdown` function backed by a library like `marked` or `remark`.
 */
function defaultRenderMarkdown(source: string): string {
  const escapeHtml = (str: string): string =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const decodeEntities = (str: string): string =>
    str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(parseInt(dec, 10)));

  const isSafeUrl = (url: string): boolean => {
    // Strip ASCII C0 control characters that can bypass scheme detection
    /* eslint-disable no-control-regex */
    const trimmed = url
      .replace(/[\x00-\x1f\x7f]/g, '')
      .trim()
      .toLowerCase();
    /* eslint-enable no-control-regex */
    if (/^(https?:|mailto:|\/|#)/.test(trimmed)) {
      return true;
    }
    // Reject anything with an explicit unsafe scheme
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      return false;
    }
    // Relative URLs are safe
    return true;
  };

  const inlineFormat = (line: string): string =>
    escapeHtml(line)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
        const decoded = decodeEntities(url);
        return isSafeUrl(decoded) ? `<a href="${url}">${text}</a>` : text;
      });

  const lines = source.split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineFormat(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      html.push('<hr />');
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line.trim())) {
      html.push('<ul>');
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        html.push(`<li>${inlineFormat(lines[i].trim().replace(/^[-*+]\s/, ''))}</li>`);
        i++;
      }
      html.push('</ul>');
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      html.push('<ol>');
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        html.push(`<li>${inlineFormat(lines[i].trim().replace(/^\d+\.\s/, ''))}</li>`);
        i++;
      }
      html.push('</ol>');
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      html.push(`<blockquote>${inlineFormat(quoteLines.join(' '))}</blockquote>`);
      continue;
    }

    // Paragraph
    html.push(`<p>${inlineFormat(line)}</p>`);
    i++;
  }

  return html.join('\n');
}

/**
 * Markdown renderer component.
 *
 * Uses a minimal built-in parser by default or accepts a custom
 * `renderMarkdown` function for full-featured rendering. Output is
 * wrapped in a `<div class="prose">` for Tailwind Typography styling.
 *
 * @example
 * ```tsx
 * // Built-in parser
 * <Markdown source="# Hello\n\nThis is **bold** and *italic*." />
 *
 * // Custom renderer (e.g. using `marked`)
 * import { marked } from 'marked';
 * <Markdown source={content} renderMarkdown={(src) => marked.parse(src)} />
 * ```
 */
export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ source, renderMarkdown, className, ...rest }, ref) => {
    const render = renderMarkdown ?? defaultRenderMarkdown;
    const html = useMemo(() => render(source), [source, render]);

    return (
      <div
        ref={ref}
        {...rest}
        className={cn('prose', className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },
);

Markdown.displayName = 'Markdown';
