/**
 * @module RichTextEditor
 *
 * The design-system RichTextEditor (#53). Formatted text editing with a
 * toolbar over the shared prose styles, on the behavior engine's built-in
 * contentEditable engine (`RichTextSurface`). Livewire runs TinyMCE behind
 * the same toolbar instead (D-003). Renders the shared
 * `.apui-rich-text-editor` markup contract, styled by `@artisanpack-ui/css`.
 */

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  countLabel,
  RICH_TEXT_COMMANDS,
  resolveToolbar,
  richTextFromHtml,
  richTextToHtml,
  richTextTranslations,
  RichTextSurface,
  rovingKeydown,
  safeImageUrl,
  safeLinkUrl,
  syncRovingTabIndex,
  type RichTextCommand,
  type RichTextOutput,
  type RichTextToolbarItem,
  type RichTextTranslations,
} from '@artisanpack-ui/behavior';

import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

export type { RichTextCommand, RichTextOutput, RichTextToolbarItem, RichTextTranslations };

/** The parts a {@link RichTextEditor} accepts extra classes for. */
export type RichTextEditorPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'toolbar'
  | 'button'
  | 'divider'
  | 'content'
  | 'placeholder'
  | 'footer'
  | 'count'
  | 'hint'
  | 'error';

/**
 * Props for the {@link RichTextEditor} component.
 *
 * `className` goes to the root, `name` to a hidden input that carries the
 * value for plain forms, and every other attribute to the root.
 */
export interface RichTextEditorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'placeholder'
> {
  /** A preset (`default`, `compact`, `minimal`) or a list of commands and `|` dividers. @defaultValue `'default'` */
  toolbar?: 'default' | 'compact' | 'minimal' | RichTextToolbarItem[];
  /** The format `value` is read and written in. Emitted as `data-output`. @defaultValue `'html'` */
  output?: RichTextOutput;
  /** The most characters allowed. Typing stops there. */
  maxLength?: number;
  /** Shows the footer with the word and character count. @defaultValue `false` */
  counter?: boolean;
  /** The visible label. It names the content. */
  label?: ReactNode;
  /** Help text under the editor. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables editing and the toolbar. @defaultValue `false` */
  disabled?: boolean;
  /** Shows the content without editing it. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required. @defaultValue `false` */
  required?: boolean;
  /** Text shown while the content is empty. */
  placeholder?: string;
  /** The content of a controlled editor, in the output format. Sanitized before it is shown. */
  value?: string;
  /** The initial content of an uncontrolled editor. */
  defaultValue?: string;
  /** The toolbar's accessible name. @defaultValue `'Formatting'` */
  toolbarLabel?: string;
  /** The Bold button's accessible name. @defaultValue `'Bold'` */
  boldLabel?: string;
  /** The Italic button's accessible name. @defaultValue `'Italic'` */
  italicLabel?: string;
  /** The Underline button's accessible name. @defaultValue `'Underline'` */
  underlineLabel?: string;
  /** The Strikethrough button's accessible name. @defaultValue `'Strikethrough'` */
  strikeLabel?: string;
  /** The Heading 2 button's accessible name. @defaultValue `'Heading 2'` */
  heading2Label?: string;
  /** The Heading 3 button's accessible name. @defaultValue `'Heading 3'` */
  heading3Label?: string;
  /** The bulleted list button's accessible name. @defaultValue `'Bulleted list'` */
  bulletListLabel?: string;
  /** The numbered list button's accessible name. @defaultValue `'Numbered list'` */
  orderedListLabel?: string;
  /** The Quote button's accessible name. @defaultValue `'Quote'` */
  quoteLabel?: string;
  /** The Code button's accessible name. @defaultValue `'Code'` */
  codeLabel?: string;
  /** The Link button's accessible name. @defaultValue `'Link'` */
  linkLabel?: string;
  /** The Image button's accessible name. @defaultValue `'Image'` */
  imageLabel?: string;
  /** The Undo button's accessible name. @defaultValue `'Undo'` */
  undoLabel?: string;
  /** The Redo button's accessible name. @defaultValue `'Redo'` */
  redoLabel?: string;
  /** The prompt that asks for a link URL (built-in engine). @defaultValue `'Link URL'` */
  linkPromptLabel?: string;
  /** The prompt that asks for an image URL (built-in engine). @defaultValue `'Image URL'` */
  imagePromptLabel?: string;
  /** The prompt that asks for an image description (built-in engine). @defaultValue `'Describe the image'` */
  imageAltPromptLabel?: string;
  /** The footer note about Markdown shortcuts. @defaultValue `'Markdown shortcuts on'` */
  shortcutsLabel?: string;
  /** The footer's word count for one word; :count is the number. @defaultValue `':count word'` */
  wordLabel?: string;
  /** The footer's word count; :count is the number. @defaultValue `':count words'` */
  wordsLabel?: string;
  /** The footer's character count for one character. @defaultValue `':count character'` */
  characterLabel?: string;
  /** The footer's character count; :count is the number. @defaultValue `':count characters'` */
  charactersLabel?: string;
  /** The footer's count with maxLength; :count and :max are numbers. @defaultValue `':count / :max characters'` */
  limitLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<RichTextEditorPart>;
  /** The submitted name of the hidden input that carries the value. */
  name?: string;
  /** Called with the new content, in the output format. */
  onValueChange?: (value: string) => void;
}

/**
 * Formatted text editing with a toolbar, controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). The value is sanitized
 * to the editor's formats before it's shown. The ref points at the root.
 *
 * @example
 * ```tsx
 * const [html, setHtml] = useState('');
 * <RichTextEditor label="Description" counter value={html} onValueChange={setHtml} />
 * ```
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      toolbar = 'default',
      output = 'html',
      maxLength,
      counter = false,
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      readonly = false,
      required = false,
      placeholder,
      value,
      defaultValue,
      toolbarLabel,
      boldLabel,
      italicLabel,
      underlineLabel,
      strikeLabel,
      heading2Label,
      heading3Label,
      bulletListLabel,
      orderedListLabel,
      quoteLabel,
      codeLabel,
      linkLabel,
      imageLabel,
      undoLabel,
      redoLabel,
      linkPromptLabel,
      imagePromptLabel,
      imageAltPromptLabel,
      shortcutsLabel,
      wordLabel,
      wordsLabel,
      characterLabel,
      charactersLabel,
      limitLabel,
      classes = {},
      name,
      onValueChange,
      className,
      id: explicitId,
      'aria-describedby': callerDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generated = useId();
    const id = explicitId ?? generated;
    const t = richTextTranslations({
      toolbar: toolbarLabel,
      bold: boldLabel,
      italic: italicLabel,
      underline: underlineLabel,
      strike: strikeLabel,
      heading2: heading2Label,
      heading3: heading3Label,
      bulletList: bulletListLabel,
      orderedList: orderedListLabel,
      quote: quoteLabel,
      code: codeLabel,
      link: linkLabel,
      image: imageLabel,
      undo: undoLabel,
      redo: redoLabel,
      linkPrompt: linkPromptLabel,
      imagePrompt: imagePromptLabel,
      imageAltPrompt: imageAltPromptLabel,
      shortcuts: shortcutsLabel,
      word: wordLabel,
      words: wordsLabel,
      character: characterLabel,
      characters: charactersLabel,
      limit: limitLabel,
    });
    const items = resolveToolbar(toolbar, output);
    const [internal, setInternal] = useState(defaultValue ?? '');
    const current = value ?? internal;
    const [active, setActive] = useState<Set<RichTextCommand>>(() => new Set());
    const [text, setText] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const content = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const surface = useRef<RichTextSurface | null>(null);
    const emitted = useRef<string | null>(null);
    const commitRef = useRef<(html: string) => void>(() => {});
    const runRef = useRef<(command: RichTextCommand) => void>(() => {});
    const editableRef = useRef(true);
    const maxLengthRef = useRef<number | undefined>(undefined);

    const isInvalid = invalid || Boolean(error);
    const editable = !disabled && !readonly;
    editableRef.current = editable;
    maxLengthRef.current = maxLength;
    const hasLabel = hasContent(label);
    const hasHint = hasContent(hint);
    const describedBy =
      [hasHint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined, callerDescribedBy]
        .filter(Boolean)
        .join(' ') || undefined;
    const isEmpty = text.trim() === '' && !hasImage;

    const measure = () => {
      setText(content.current?.textContent ?? '');
      setHasImage(Boolean(content.current?.querySelector('img')));
    };

    commitRef.current = (html: string) => {
      measure();
      const next = richTextFromHtml(html, output);
      if (next === current) return;
      emitted.current = next;
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    useEffect(() => {
      const root = content.current;
      if (!root) return undefined;
      const engine = new RichTextSurface(root, {
        onChange: (html) => commitRef.current(html),
        onSelectionChange: () => setActive(engine.active()),
        // Through refs: the engine outlives this render's closures.
        onLinkShortcut: () => runRef.current('link'),
        canEdit: () => editableRef.current,
        maxLength: () => maxLengthRef.current,
      });
      surface.current = engine;
      engine.setHtml(richTextToHtml(current, output));
      emitted.current = current;
      measure();
      if (toolbarRef.current) syncRovingTabIndex(toolbarRef.current, '[data-part="button"]');
      return () => {
        engine.destroy();
        surface.current = null;
      };
      // The engine owns the content after mount; external values are set below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (current === emitted.current) return;
      emitted.current = current;
      surface.current?.setHtml(richTextToHtml(current, output));
      measure();
    }, [current, output]);

    const run = (command: RichTextCommand) => {
      const engine = surface.current;
      if (!engine || !editable) return;
      if (command === 'link') {
        const url = engine.active().has('link') ? '' : window.prompt(t.linkPrompt, 'https://');
        if (url === null) return;
        engine.run('link', safeLinkUrl(url) ?? '');
        return;
      }
      if (command === 'image') {
        const src = safeImageUrl(window.prompt(t.imagePrompt, 'https://'));
        if (!src) return;
        engine.run('image', { src, alt: window.prompt(t.imageAltPrompt, '') ?? '' });
        return;
      }
      engine.run(command);
    };

    runRef.current = run;

    const toolbarKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (toolbarRef.current) {
        rovingKeydown(event.nativeEvent, toolbarRef.current, '[data-part="button"]');
      }
    };

    let firstButton = true;

    return (
      <div
        {...rest}
        ref={ref}
        id={id}
        className={cx('apui-rich-text-editor', classes.root, className)}
        data-output={output}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-readonly={flag(readonly)}
      >
        {hasLabel ? (
          <span
            className={classes.label}
            data-scope="rich-text-editor"
            data-part="label"
            id={`${id}-label`}
          >
            {label}
            {required ? (
              <span
                className={classes.required}
                data-scope="rich-text-editor"
                data-part="required"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
          </span>
        ) : null}
        <div className={classes.box} data-scope="rich-text-editor" data-part="box" id={`${id}-box`}>
          <div
            ref={toolbarRef}
            className={classes.toolbar}
            data-scope="rich-text-editor"
            data-part="toolbar"
            id={`${id}-toolbar`}
            role="toolbar"
            aria-label={t.toolbar}
            aria-controls={`${id}-content`}
            onKeyDown={toolbarKeydown}
          >
            {items.map((item, index) => {
              if (item === '|') {
                return (
                  <span
                    key={`divider-${index}`}
                    className={classes.divider}
                    data-scope="rich-text-editor"
                    data-part="divider"
                    role="separator"
                    aria-orientation="vertical"
                  />
                );
              }
              const tabIndex = firstButton ? 0 : -1;
              firstButton = false;
              const { icon, toggle } = RICH_TEXT_COMMANDS[item];
              return (
                <button
                  key={item}
                  type="button"
                  className={classes.button}
                  data-scope="rich-text-editor"
                  data-part="button"
                  data-command={item}
                  id={`${id}-${item}`}
                  aria-label={t[item]}
                  tabIndex={tabIndex}
                  aria-pressed={toggle ? active.has(item) : undefined}
                  disabled={!editable || undefined}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => run(item)}
                >
                  <IconSvg name={icon} />
                </button>
              );
            })}
          </div>
          <div
            ref={content}
            className={classes.content}
            data-scope="rich-text-editor"
            data-part="content"
            id={`${id}-content`}
            contentEditable={editable}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-labelledby={hasLabel ? `${id}-label` : undefined}
            aria-describedby={describedBy}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            aria-readonly={readonly || undefined}
            aria-disabled={disabled || undefined}
            aria-placeholder={placeholder || undefined}
          />
          {placeholder ? (
            <p
              className={classes.placeholder}
              data-scope="rich-text-editor"
              data-part="placeholder"
              aria-hidden="true"
              hidden={!isEmpty}
            >
              {placeholder}
            </p>
          ) : null}
          {counter || maxLength ? (
            <div className={classes.footer} data-scope="rich-text-editor" data-part="footer">
              <span>{t.shortcuts}</span>
              <span className={classes.count} data-scope="rich-text-editor" data-part="count">
                {countLabel(text, t, maxLength)}
              </span>
            </div>
          ) : null}
        </div>
        <input type="hidden" name={name} value={current} />
        {hasHint ? (
          <p
            className={classes.hint}
            data-scope="rich-text-editor"
            data-part="hint"
            id={`${id}-hint`}
          >
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            className={classes.error}
            data-scope="rich-text-editor"
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

RichTextEditor.displayName = 'RichTextEditor';
