/**
 * @module Diff
 *
 * Text diff viewer component that compares two strings line-by-line using an
 * LCS (Longest Common Subsequence) algorithm. Supports inline and side-by-side
 * display modes with colored highlighting for added, removed, and unchanged lines.
 */

import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Diff} component.
 */
export interface DiffProps extends HTMLAttributes<HTMLDivElement> {
  /** The original text content to compare. */
  oldContent: string;
  /** The modified text content to compare against the original. */
  newContent: string;
  /** Label for the original content column. @defaultValue 'Original' */
  oldLabel?: string;
  /** Label for the modified content column. @defaultValue 'Modified' */
  newLabel?: string;
  /** Display mode: 'inline' shows a single unified view, 'side-by-side' shows two columns. @defaultValue 'inline' */
  mode?: 'side-by-side' | 'inline';
}

/**
 * Represents a single line in the computed diff output.
 * @internal
 */
interface DiffLine {
  /** Whether this line was added, removed, or unchanged. */
  type: 'same' | 'added' | 'removed';
  /** The text content of this line. */
  content: string;
  /** Line number in the original content (undefined for added lines). */
  oldLineNum?: number;
  /** Line number in the modified content (undefined for removed lines). */
  newLineNum?: number;
}

/**
 * Computes a line-by-line diff between two text strings using an LCS approach.
 *
 * @param oldText - The original text.
 * @param newText - The modified text.
 * @returns Array of diff lines with type indicators and line numbers.
 */
function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText === '' ? [] : oldText.split('\n');
  const newLines = newText === '' ? [] : newText.split('\n');
  const result: DiffLine[] = [];

  let oldIdx = 0;
  let newIdx = 0;

  // Simple line-by-line diff using LCS approach
  const lcs = computeLCS(oldLines, newLines);
  let lcsIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (lcsIdx < lcs.length && oldIdx < oldLines.length && oldLines[oldIdx] === lcs[lcsIdx]) {
      if (newIdx < newLines.length && newLines[newIdx] === lcs[lcsIdx]) {
        result.push({
          type: 'same',
          content: oldLines[oldIdx],
          oldLineNum: oldIdx + 1,
          newLineNum: newIdx + 1,
        });
        oldIdx++;
        newIdx++;
        lcsIdx++;
      } else if (newIdx < newLines.length) {
        result.push({
          type: 'added',
          content: newLines[newIdx],
          newLineNum: newIdx + 1,
        });
        newIdx++;
      }
    } else if (oldIdx < oldLines.length) {
      result.push({
        type: 'removed',
        content: oldLines[oldIdx],
        oldLineNum: oldIdx + 1,
      });
      oldIdx++;
    } else if (newIdx < newLines.length) {
      result.push({
        type: 'added',
        content: newLines[newIdx],
        newLineNum: newIdx + 1,
      });
      newIdx++;
    }
  }

  return result;
}

/**
 * Computes the Longest Common Subsequence of two string arrays using dynamic programming.
 *
 * @param a - First array of strings.
 * @param b - Second array of strings.
 * @returns The longest common subsequence as an array of strings.
 */
function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.push(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  result.reverse();
  return result;
}

const lineTypeClasses: Record<DiffLine['type'], string> = {
  added: 'bg-success/20 text-success-content',
  removed: 'bg-error/20 text-error-content',
  same: '',
};

const linePrefix: Record<DiffLine['type'], string> = {
  added: '+',
  removed: '-',
  same: ' ',
};

/**
 * Text diff viewer with inline or side-by-side display modes.
 *
 * Computes a line-by-line diff using LCS and renders added lines in green,
 * removed lines in red, and unchanged lines without highlighting.
 * Both modes show line numbers and +/- prefix indicators.
 *
 * @example
 * ```tsx
 * <Diff
 *   oldContent="Hello\nWorld"
 *   newContent="Hello\nReact\nWorld"
 *   mode="side-by-side"
 *   oldLabel="Before"
 *   newLabel="After"
 * />
 * ```
 */
export const Diff = forwardRef<HTMLDivElement, DiffProps>(
  (
    {
      oldContent,
      newContent,
      oldLabel = 'Original',
      newLabel = 'Modified',
      mode = 'inline',
      className,
      ...rest
    },
    ref,
  ) => {
    const diffLines = useMemo(() => computeDiff(oldContent, newContent), [oldContent, newContent]);

    if (mode === 'side-by-side') {
      return (
        <div ref={ref} className={cn('overflow-auto font-mono text-sm', className)} {...rest}>
          <div className="grid grid-cols-2 divide-x divide-base-300">
            <div className="bg-base-300 px-4 py-2 font-semibold text-sm">{oldLabel}</div>
            <div className="bg-base-300 px-4 py-2 font-semibold text-sm">{newLabel}</div>
          </div>
          {diffLines.map((line, i) => (
            <div key={i} className="grid grid-cols-2 divide-x divide-base-300">
              {/* Left pane */}
              <div className={cn('flex', line.type === 'removed' && 'bg-error/20')}>
                {line.type !== 'added' ? (
                  <>
                    <span className="select-none w-12 text-right pr-3 opacity-40 shrink-0">
                      {line.oldLineNum ?? ''}
                    </span>
                    <span className="select-none w-6 text-center opacity-40 shrink-0">
                      {linePrefix[line.type]}
                    </span>
                    <pre className="whitespace-pre-wrap flex-1 px-2 py-0.5">
                      <code>{line.content}</code>
                    </pre>
                  </>
                ) : (
                  <pre className="whitespace-pre-wrap flex-1 px-2 py-0.5">
                    <code>&nbsp;</code>
                  </pre>
                )}
              </div>
              {/* Right pane */}
              <div className={cn('flex', line.type === 'added' && 'bg-success/20')}>
                {line.type !== 'removed' ? (
                  <>
                    <span className="select-none w-12 text-right pr-3 opacity-40 shrink-0">
                      {line.newLineNum ?? ''}
                    </span>
                    <span className="select-none w-6 text-center opacity-40 shrink-0">
                      {linePrefix[line.type]}
                    </span>
                    <pre className="whitespace-pre-wrap flex-1 px-2 py-0.5">
                      <code>{line.content}</code>
                    </pre>
                  </>
                ) : (
                  <pre className="whitespace-pre-wrap flex-1 px-2 py-0.5">
                    <code>&nbsp;</code>
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('overflow-auto font-mono text-sm', className)} {...rest}>
        <div className="grid grid-cols-2 gap-4 bg-base-300 px-4 py-2 font-semibold text-sm">
          <span>{oldLabel}</span>
          <span>{newLabel}</span>
        </div>
        {diffLines.map((line, i) => (
          <div key={i} className={cn('flex', lineTypeClasses[line.type])}>
            <span className="select-none w-12 text-right pr-3 opacity-40 shrink-0">
              {line.oldLineNum ?? ''}
            </span>
            <span className="select-none w-12 text-right pr-3 opacity-40 shrink-0">
              {line.newLineNum ?? ''}
            </span>
            <span className="select-none w-6 text-center opacity-40 shrink-0">
              {linePrefix[line.type]}
            </span>
            <pre className="whitespace-pre-wrap flex-1 px-2 py-0.5">
              <code>{line.content}</code>
            </pre>
          </div>
        ))}
      </div>
    );
  },
);

Diff.displayName = 'Diff';
