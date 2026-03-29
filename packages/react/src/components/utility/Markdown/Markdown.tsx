import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Raw markdown source text */
  source: string;
  /** Custom render function — receives the raw source and should return an HTML string.
   *  When omitted a minimal built-in parser handles headings, bold, italic, code,
   *  links, unordered lists, ordered lists, blockquotes, horizontal rules, and paragraphs. */
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

  const isSafeUrl = (url: string): boolean => {
    const trimmed = url.trim().toLowerCase();
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
        const decoded = url.replace(/&amp;/g, '&');
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
 * Uses a minimal built-in parser by default or accepts a custom `renderMarkdown`
 * function for full-featured rendering (e.g. via `marked` or `remark`).
 */
export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ source, renderMarkdown, className, ...rest }, ref) => {
    const render = renderMarkdown ?? defaultRenderMarkdown;
    const html = useMemo(() => render(source), [source, render]);

    return (
      <div
        ref={ref}
        className={cn('prose', className)}
        dangerouslySetInnerHTML={{ __html: html }}
        {...rest}
      />
    );
  },
);

Markdown.displayName = 'Markdown';
