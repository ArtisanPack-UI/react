/**
 * @module Diff
 *
 * The design-system Diff (#61): the changes between two versions of a text,
 * rendering the `.apui-diff` markup contract styled by `@artisanpack-ui/css`.
 * The rows come from the behavior package's `diffText`, the same ones Blade
 * and Vue render: no diff library. The table stays LTR (D-004).
 *
 * @packageDocumentation
 */

import {
  DIFF_COUNTS_LABEL,
  DIFF_EMPTY_LABEL,
  diffCountsLabel,
  diffText,
  splitRows,
  type DiffSegment,
} from '@artisanpack-ui/behavior';
import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** One column or the two versions side by side. Emitted as `data-view`. */
export type DiffView = 'unified' | 'split';

/** The parts a {@link Diff} accepts extra classes for. */
export type DiffPart =
  | 'root'
  | 'header'
  | 'icon'
  | 'file'
  | 'counts'
  | 'actions'
  | 'table'
  | 'hunk'
  | 'line'
  | 'lineNumber'
  | 'sign'
  | 'code'
  | 'ins'
  | 'del';

/** Props for the {@link Diff} component. Native `<div>` attributes go to the root. */
export interface DiffProps extends HTMLAttributes<HTMLDivElement> {
  /** The earlier version. */
  oldContent?: string;
  /** The later version. */
  newContent?: string;
  /** What changed, at the start of the header. */
  fileName?: ReactNode;
  /** One column, or the versions side by side. @defaultValue `'unified'` */
  view?: DiffView;
  /** Marks the changed words inside a changed line. @defaultValue `true` */
  wordLevel?: boolean;
  /** Unchanged lines kept around each change. @defaultValue `3` */
  context?: number;
  /**
   * The counts' text for assistive technology; `{additions}` and
   * `{deletions}` are filled in. Translate it.
   * @defaultValue `'{additions} additions, {deletions} deletions'`
   */
  countsLabel?: string;
  /** Shown when the versions are the same; translate it. @defaultValue `'No changes'` */
  emptyLabel?: string;
  /** Header controls, such as a copy button or a view switch. */
  actions?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<DiffPart>;
}

const SIGNS: Record<string, string> = { add: '+', del: '−', ctx: ' ', empty: '' };

function Code({
  segments,
  type,
  classes,
}: {
  segments: DiffSegment[];
  type: string;
  classes: PartClasses<DiffPart>;
}) {
  const tag = type === 'del' ? 'del' : 'ins';
  return (
    <>
      {segments.map((segment, index) =>
        segment.changed && (type === 'add' || type === 'del') ? (
          tag === 'del' ? (
            <del key={index} className={classes.del} data-scope="diff" data-part="del">
              {segment.text}
            </del>
          ) : (
            <ins key={index} className={classes.ins} data-scope="diff" data-part="ins">
              {segment.text}
            </ins>
          )
        ) : (
          segment.text
        ),
      )}
    </>
  );
}

function Cells({
  number,
  type,
  segments,
  classes,
}: {
  number: number | null;
  type: string;
  segments: DiffSegment[];
  classes: PartClasses<DiffPart>;
}) {
  return (
    <>
      <td className={classes.lineNumber} data-scope="diff" data-part="lineNumber" data-type={type}>
        {number}
      </td>
      <td className={classes.sign} data-scope="diff" data-part="sign" data-type={type}>
        {SIGNS[type]}
      </td>
      <td className={classes.code} data-scope="diff" data-part="code" data-type={type}>
        <Code segments={segments} type={type} classes={classes} />
      </td>
    </>
  );
}

/**
 * The changes between two versions of a text. The ref points at the root `<div>`.
 *
 * @example
 * ```tsx
 * <Diff oldContent={before} newContent={after} fileName="listings/grove.json" />
 * ```
 */
export const Diff = forwardRef<HTMLDivElement, DiffProps>(
  (
    {
      oldContent,
      newContent,
      fileName,
      view = 'unified',
      wordLevel = true,
      context = 3,
      countsLabel = DIFF_COUNTS_LABEL,
      emptyLabel = DIFF_EMPTY_LABEL,
      actions,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const result = useMemo(
      () => diffText(oldContent, newContent, { context, wordLevel }),
      [oldContent, newContent, context, wordLevel],
    );
    const shown: DiffView = view === 'split' ? 'split' : 'unified';
    const columns = shown === 'split' ? 6 : 4;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-diff', classes.root, className)}
        data-view={shown}
      >
        <div className={classes.header} data-scope="diff" data-part="header">
          <span className={classes.icon} data-scope="diff" data-part="icon" aria-hidden="true">
            <IconSvg name="git-compare" />
          </span>
          {hasContent(fileName) ? (
            <span className={classes.file} data-scope="diff" data-part="file">
              {fileName}
            </span>
          ) : null}
          <span className={classes.counts} data-scope="diff" data-part="counts">
            <span className="apui-sr-only">
              {diffCountsLabel(countsLabel, result.additions, result.deletions)}
            </span>
            <span data-type="add" aria-hidden="true">{`+${result.additions}`}</span>
            <span data-type="del" aria-hidden="true">{`−${result.deletions}`}</span>
          </span>
          {hasContent(actions) ? (
            <div className={classes.actions} data-scope="diff" data-part="actions">
              {actions}
            </div>
          ) : null}
        </div>
        <table className={classes.table} data-scope="diff" data-part="table">
          <tbody>
            {result.hunks.length === 0 ? (
              <tr className={classes.hunk} data-scope="diff" data-part="hunk">
                <td colSpan={columns}>{emptyLabel}</td>
              </tr>
            ) : null}
            {result.hunks.map((hunk, hunkIndex) => [
              <tr
                key={`hunk-${hunkIndex}`}
                className={classes.hunk}
                data-scope="diff"
                data-part="hunk"
              >
                <td colSpan={columns}>{hunk.header}</td>
              </tr>,
              ...(shown === 'split'
                ? splitRows(hunk.lines).map((row, index) => (
                    <tr
                      key={`${hunkIndex}-${index}`}
                      className={classes.line}
                      data-scope="diff"
                      data-part="line"
                    >
                      <Cells
                        number={row.old.number}
                        type={row.old.type}
                        segments={row.old.segments}
                        classes={classes}
                      />
                      <Cells
                        number={row.new.number}
                        type={row.new.type}
                        segments={row.new.segments}
                        classes={classes}
                      />
                    </tr>
                  ))
                : hunk.lines.map((line, index) => (
                    <tr
                      key={`${hunkIndex}-${index}`}
                      className={classes.line}
                      data-scope="diff"
                      data-part="line"
                      data-type={line.type}
                    >
                      <td
                        className={classes.lineNumber}
                        data-scope="diff"
                        data-part="lineNumber"
                        data-type={line.type}
                      >
                        {line.oldNumber}
                      </td>
                      <Cells
                        number={line.newNumber}
                        type={line.type}
                        segments={line.segments}
                        classes={classes}
                      />
                    </tr>
                  ))),
            ])}
          </tbody>
        </table>
      </div>
    );
  },
);

Diff.displayName = 'Diff';
