/**
 * @module CodeEditor
 *
 * The design-system CodeEditor (#53), which replaces the monospace `Editor`.
 * Editable code in a native textarea with file tabs, a language select,
 * line numbers, the active line, diagnostics listed in text and a status
 * bar. Renders the shared `.apui-code-editor` markup contract, styled by
 * `@artisanpack-ui/css`. The code stays left to right in RTL (D-004).
 */

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import {
  codeEditorKeydown,
  codeEditorTranslations,
  gutterLines,
  normalizeOptions,
  positionLabel as formatPosition,
  problemsLabel as formatProblems,
  rovingKeydown,
  severityByLine,
  type CodeDiagnostic,
  type CodeEditorTranslations,
} from '@artisanpack-ui/behavior';

import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

export type { CodeDiagnostic, CodeEditorTranslations };

/** A tab or language option: a string, or a value with a label. */
export type CodeEditorOption = string | { value: string; label?: string };

/** The parts a {@link CodeEditor} accepts extra classes for. */
export type CodeEditorPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'header'
  | 'tabs'
  | 'tab'
  | 'languageSelect'
  | 'body'
  | 'gutter'
  | 'line'
  | 'control'
  | 'diagnostics'
  | 'diagnostic'
  | 'status'
  | 'hint'
  | 'error';

/**
 * Props for the {@link CodeEditor} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `id`, …) goes to the native `<textarea>`.
 */
export interface CodeEditorProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'rows'
> {
  /** The language, shown in the status bar and selected in the language select. */
  language?: string;
  /** Options for the language select. */
  languages?: CodeEditorOption[];
  /** File tabs, rendered as a tablist over the code. */
  tabs?: CodeEditorOption[];
  /** The selected tab's value. Defaults to the first tab. */
  tab?: string;
  /** Problems by line, marked in the gutter and listed in text. */
  diagnostics?: CodeDiagnostic[];
  /** Spaces Tab inserts. @defaultValue `2` */
  tabSize?: number;
  /** The fewest lines shown; the editor grows with its content. @defaultValue `12` */
  rows?: number;
  /** The visible label, linked to the control. */
  label?: ReactNode;
  /** Help text under the editor. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Makes the code read-only. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** The code of a controlled editor. */
  value?: string;
  /** The code of an uncontrolled editor. */
  defaultValue?: string;
  /** The file tablist's accessible name. @defaultValue `'Open files'` */
  tabsLabel?: string;
  /** The language select's accessible name. @defaultValue `'Language'` */
  languageLabel?: string;
  /** The caret position in the status bar; :line and :column are numbers. @defaultValue `'Ln :line, Col :column'` */
  positionLabel?: string;
  /** The indentation in the status bar; :count is tabSize. @defaultValue `'Spaces: :count'` */
  spacesLabel?: string;
  /** The status bar's count for one error. @defaultValue `':count error'` */
  errorCountLabel?: string;
  /** The status bar's error count; :count is the number. @defaultValue `':count errors'` */
  errorsCountLabel?: string;
  /** The status bar's count for one warning. @defaultValue `':count warning'` */
  warningCountLabel?: string;
  /** The status bar's warning count; :count is the number. @defaultValue `':count warnings'` */
  warningsCountLabel?: string;
  /** The diagnostics list's accessible name. @defaultValue `'Problems'` */
  problemsLabel?: string;
  /** A diagnostic's line; :line is the number. @defaultValue `'Line :line'` */
  lineLabel?: string;
  /** The visually hidden severity name of an error. @defaultValue `'Error'` */
  severityErrorLabel?: string;
  /** The visually hidden severity name of a warning. @defaultValue `'Warning'` */
  severityWarningLabel?: string;
  /** The visually hidden severity name of an info diagnostic. @defaultValue `'Info'` */
  severityInfoLabel?: string;
  /** The visually hidden keyboard instructions linked to the control. @defaultValue `'Tab inserts indentation. To leave the editor, press Escape, then Tab.'` */
  instructionsLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CodeEditorPart>;
  /** Called with the new code. The native `onChange` still fires. */
  onValueChange?: (value: string) => void;
  /** Called with a tab's value when it's selected. */
  onTabChange?: (value: string) => void;
  /** Called with a language's value when it's chosen. */
  onLanguageChange?: (value: string) => void;
}

const SEVERITY_ICONS = { error: 'circle-alert', warning: 'triangle-alert', info: 'info' } as const;

/**
 * Editable code in a native textarea. Tab indents; Escape, then Tab, leaves.
 * The ref points at the `<textarea>`.
 *
 * @example
 * ```tsx
 * const [css, setCss] = useState('');
 * <CodeEditor label="Custom CSS" language="CSS" value={css} onValueChange={setCss} />
 * ```
 */
export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      language,
      languages,
      tabs,
      tab,
      diagnostics,
      tabSize = 2,
      rows = 12,
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      readonly,
      readOnly,
      required = false,
      placeholder,
      value,
      defaultValue,
      tabsLabel,
      languageLabel,
      positionLabel,
      spacesLabel,
      errorCountLabel,
      errorsCountLabel,
      warningCountLabel,
      warningsCountLabel,
      problemsLabel,
      lineLabel,
      severityErrorLabel,
      severityWarningLabel,
      severityInfoLabel,
      instructionsLabel,
      classes = {},
      onValueChange,
      onTabChange,
      onLanguageChange,
      onChange,
      onKeyDown,
      onSelect,
      className,
      id: explicitId,
      'aria-describedby': callerDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generated = useId();
    const id = explicitId ?? generated;
    const t = codeEditorTranslations({
      tabs: tabsLabel,
      language: languageLabel,
      position: positionLabel,
      spaces: spacesLabel,
      error: errorCountLabel,
      errors: errorsCountLabel,
      warning: warningCountLabel,
      warnings: warningsCountLabel,
      problems: problemsLabel,
      line: lineLabel,
      severityError: severityErrorLabel,
      severityWarning: severityWarningLabel,
      severityInfo: severityInfoLabel,
      instructions: instructionsLabel,
    });
    const isReadonly = readonly ?? readOnly ?? false;
    const isInvalid = invalid || Boolean(error);
    const tabList = normalizeOptions(tabs);
    const languageList = normalizeOptions(languages);
    const [internal, setInternal] = useState(defaultValue ?? '');
    const code = value ?? internal;
    const [internalTab, setSelectedTab] = useState(tabList[0]?.value);
    const selectedTab = tab ?? internalTab;
    const [caret, setCaret] = useState(0);
    const [tracking, setTracking] = useState(false);
    const control = useRef<HTMLTextAreaElement | null>(null);
    const tabsRef = useRef<HTMLDivElement>(null);

    const setRefs = (element: HTMLTextAreaElement | null) => {
      control.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    };

    const lineTotal = gutterLines(code, rows);
    const severities = severityByLine(diagnostics);
    const activeLine = code.slice(0, caret).split('\n').length;
    const problems = formatProblems(diagnostics, t);
    const languageName =
      language === undefined || language === ''
        ? undefined
        : (languageList.find((option) => option.value === language)?.label ?? language);
    const hasLabel = hasContent(label);
    const hasHint = hasContent(hint);
    const selectedIndex = tabList.findIndex((item) => item.value === selectedTab);
    const describedBy = [
      hasHint ? `${id}-hint` : undefined,
      error ? `${id}-error` : undefined,
      `${id}-instructions`,
      callerDescribedBy,
    ]
      .filter(Boolean)
      .join(' ');

    const track = () => {
      setTracking(true);
      setCaret(control.current?.selectionStart ?? 0);
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      if (value === undefined) setInternal(event.target.value);
      onValueChange?.(event.target.value);
      setTracking(true);
      setCaret(event.target.selectionStart);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (control.current) codeEditorKeydown(event.nativeEvent, control.current, tabSize);
    };

    const selectTab = (next: string) => {
      if (next === selectedTab) return;
      setSelectedTab(next);
      onTabChange?.(next);
    };

    const tabsKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!tabsRef.current) return;
      const focused = rovingKeydown(event.nativeEvent, tabsRef.current, '[data-part="tab"]');
      const next = focused?.getAttribute('data-value');
      if (next) selectTab(next);
    };

    return (
      <div
        className={cx('apui-code-editor', classes.root, className)}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-readonly={flag(isReadonly)}
      >
        {hasLabel ? (
          <label className={classes.label} data-scope="code-editor" data-part="label" htmlFor={id}>
            {label}
            {required ? (
              <span
                className={classes.required}
                data-scope="code-editor"
                data-part="required"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div className={classes.box} data-scope="code-editor" data-part="box">
          {tabList.length || languageList.length ? (
            <div className={classes.header} data-scope="code-editor" data-part="header">
              {tabList.length ? (
                <div
                  ref={tabsRef}
                  className={classes.tabs}
                  data-scope="code-editor"
                  data-part="tabs"
                  id={`${id}-tabs`}
                  role="tablist"
                  aria-label={t.tabs}
                  onKeyDown={tabsKeydown}
                >
                  {tabList.map((item, index) => {
                    const selected = item.value === selectedTab;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        className={classes.tab}
                        data-scope="code-editor"
                        data-part="tab"
                        data-value={item.value}
                        id={`${id}-tab-${index}`}
                        role="tab"
                        aria-controls={`${id}-body`}
                        aria-selected={selected}
                        tabIndex={selected || (selectedIndex === -1 && index === 0) ? 0 : -1}
                        onClick={() => selectTab(item.value)}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {languageList.length ? (
                <select
                  className={classes.languageSelect}
                  data-scope="code-editor"
                  data-part="languageSelect"
                  id={`${id}-language`}
                  aria-label={t.language}
                  value={language ?? ''}
                  disabled={disabled || undefined}
                  onChange={(event) => onLanguageChange?.(event.target.value)}
                >
                  {language === undefined ? <option value="" hidden /> : null}
                  {languageList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ) : null}
          <div
            className={classes.body}
            data-scope="code-editor"
            data-part="body"
            id={`${id}-body`}
            dir="ltr"
            role={tabList.length ? 'tabpanel' : undefined}
            aria-labelledby={
              tabList.length && selectedIndex !== -1 ? `${id}-tab-${selectedIndex}` : undefined
            }
          >
            <div
              className={classes.gutter}
              data-scope="code-editor"
              data-part="gutter"
              aria-hidden="true"
            >
              {Array.from({ length: lineTotal }, (_, i) => (
                <span
                  key={i}
                  className={classes.line}
                  data-scope="code-editor"
                  data-part="line"
                  data-active={flag(tracking && i + 1 === activeLine)}
                  data-severity={severities.get(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <textarea
              {...rest}
              ref={setRefs}
              className={classes.control}
              data-scope="code-editor"
              data-part="control"
              id={id}
              rows={lineTotal}
              wrap="off"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              placeholder={placeholder}
              value={code}
              disabled={disabled || undefined}
              readOnly={isReadonly || undefined}
              required={required || undefined}
              aria-invalid={isInvalid || undefined}
              aria-describedby={describedBy}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onSelect={(event) => {
                onSelect?.(event);
                track();
              }}
              onFocus={(event) => {
                rest.onFocus?.(event);
                track();
              }}
            />
          </div>
          {diagnostics?.length ? (
            <ul
              className={classes.diagnostics}
              data-scope="code-editor"
              data-part="diagnostics"
              aria-label={t.problems}
            >
              {diagnostics.map((diagnostic, index) => {
                const severity = diagnostic.severity ?? 'error';
                const severityName =
                  severity === 'warning'
                    ? t.severityWarning
                    : severity === 'info'
                      ? t.severityInfo
                      : t.severityError;
                return (
                  <li
                    key={`${diagnostic.line}-${index}`}
                    className={classes.diagnostic}
                    data-scope="code-editor"
                    data-part="diagnostic"
                    data-severity={severity}
                  >
                    <IconSvg name={SEVERITY_ICONS[severity]} />
                    <span className="apui-sr-only">{severityName}:</span>
                    <span>{t.line.split(':line').join(String(diagnostic.line))}</span>
                    <span>{diagnostic.message}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <div className={classes.status} data-scope="code-editor" data-part="status">
            {problems ? <span>{problems}</span> : null}
            <span>{formatPosition(code, caret, t)}</span>
            <span>{t.spaces.split(':count').join(String(Math.max(1, tabSize)))}</span>
            {languageName ? <span>{languageName}</span> : null}
          </div>
        </div>
        <span
          className="apui-sr-only"
          data-scope="code-editor"
          data-part="instructions"
          id={`${id}-instructions`}
        >
          {t.instructions}
        </span>
        {hasHint ? (
          <p className={classes.hint} data-scope="code-editor" data-part="hint" id={`${id}-hint`}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            className={classes.error}
            data-scope="code-editor"
            data-part="error"
            id={`${id}-error`}
          >
            <IconSvg name="circle-alert" />
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

CodeEditor.displayName = 'CodeEditor';
