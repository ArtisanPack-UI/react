/**
 * @module Signature
 *
 * The design-system Signature (#53). Captures a signature by drawing,
 * typing or uploading; every mode gives the same value, a PNG data URL.
 * Renders the shared `.apui-signature` markup contract, styled by
 * `@artisanpack-ui/css`, and drives the pad with the behavior engine's
 * `SignaturePad`, ported from the `forms` package's signature pads.
 */

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  initialSignatureMode,
  readSignatureImage,
  renderTypedSignature,
  signatureModes,
  SignaturePad,
  signatureTranslations,
  type SignatureMode,
  type SignatureTranslations,
} from '@artisanpack-ui/behavior';

import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

export type { SignatureMode, SignatureTranslations };

/** The ink of a {@link Signature}: the text color, or a semantic color's text tone. */
export type SignaturePenColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts a {@link Signature} accepts extra classes for. */
export type SignaturePart =
  | 'root'
  | 'label'
  | 'required'
  | 'modes'
  | 'mode'
  | 'pad'
  | 'line'
  | 'mark'
  | 'ink'
  | 'typed'
  | 'upload'
  | 'tools'
  | 'undo'
  | 'clear'
  | 'placeholder'
  | 'hint'
  | 'error';

/**
 * Props for the {@link Signature} component.
 *
 * `className` goes to the root, `name` to a hidden input that carries the
 * value for plain forms, and every other attribute to the root.
 */
export interface SignatureProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'placeholder'
> {
  /** The mode shown first. Emitted as `data-mode`. @defaultValue `'draw'` */
  mode?: SignatureMode;
  /** The modes offered. `type` is always added: it's the keyboard path. @defaultValue all three */
  modes?: SignatureMode[];
  /** The ink. Emitted as `data-pen-color`. @defaultValue `'default'` */
  penColor?: SignaturePenColor;
  /** The visible label. It names the group. */
  label?: ReactNode;
  /** Help text under the pad, such as who is signing and the date. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables drawing, typing, uploading and the tools. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** The text under the signing line. @defaultValue `'Sign above the line'` */
  placeholder?: string;
  /** The value of a controlled signature: a PNG data URL, or `''`. */
  value?: string;
  /** The initial value of an uncontrolled signature. */
  defaultValue?: string;
  /** The mode switch group's accessible name. @defaultValue `'Signature method'` */
  modesLabel?: string;
  /** The draw mode button. @defaultValue `'Draw'` */
  drawLabel?: string;
  /** The type mode button. @defaultValue `'Type'` */
  typeLabel?: string;
  /** The upload mode button. @defaultValue `'Upload'` */
  uploadLabel?: string;
  /** The canvas's accessible name. @defaultValue `'Signature pad. Draw with a mouse, finger or stylus, or choose Type.'` */
  padLabel?: string;
  /** The typed-name input's accessible name. @defaultValue `'Type your full name'` */
  typedLabel?: string;
  /** The upload trigger's text. @defaultValue `'Choose an image'` */
  uploadTriggerLabel?: string;
  /** The icon-only undo button's accessible name. @defaultValue `'Undo stroke'` */
  undoLabel?: string;
  /** The clear button's text. @defaultValue `'Clear'` */
  clearLabel?: string;
  /** Announced in the live region after clearing. @defaultValue `'Signature cleared.'` */
  clearedLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<SignaturePart>;
  /** The submitted name of the hidden input that carries the value. */
  name?: string;
  /** Called with the new value: a PNG data URL, or `''` once cleared. */
  onValueChange?: (value: string) => void;
}

/**
 * Captures a signature by drawing, typing or uploading. Controlled (`value`
 * + `onValueChange`) or uncontrolled (`defaultValue`). The ref points at the
 * root.
 *
 * @example
 * ```tsx
 * const [signature, setSignature] = useState('');
 * <Signature label="Signature" hint="Olivia Rhye · Nov 7, 2026" value={signature} onValueChange={setSignature} />
 * ```
 */
export const Signature = forwardRef<HTMLDivElement, SignatureProps>(
  (
    {
      mode: modeProp = 'draw',
      modes: modesProp,
      penColor = 'default',
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      required = false,
      placeholder,
      value,
      defaultValue,
      modesLabel,
      drawLabel,
      typeLabel,
      uploadLabel,
      padLabel,
      typedLabel,
      uploadTriggerLabel,
      undoLabel,
      clearLabel,
      clearedLabel,
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
    const t = signatureTranslations({
      modes: modesLabel,
      draw: drawLabel,
      type: typeLabel,
      upload: uploadLabel,
      pad: padLabel,
      typed: typedLabel,
      uploadTrigger: uploadTriggerLabel,
      undo: undoLabel,
      clear: clearLabel,
      cleared: clearedLabel,
    });
    const modes = signatureModes(modesProp);
    const [mode, setMode] = useState<SignatureMode>(() => initialSignatureMode(modeProp, modes));
    const [internal, setInternal] = useState(defaultValue ?? '');
    const current = value ?? internal;
    const [typed, setTyped] = useState('');
    const [canUndo, setCanUndo] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const canvas = useRef<HTMLCanvasElement>(null);
    const typedInput = useRef<HTMLInputElement>(null);
    const pad = useRef<SignaturePad | null>(null);
    const emitted = useRef<string | null>(null);
    const onChangeRef = useRef<(next: string) => void>(() => {});

    const isInvalid = invalid || Boolean(error);
    const hasLabel = hasContent(label);
    const hasHint = hasContent(hint);
    const describedBy =
      [hasHint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined, callerDescribedBy]
        .filter(Boolean)
        .join(' ') || undefined;
    const isEmpty = current === '';

    const commit = (next: string) => {
      emitted.current = next;
      setCanUndo(pad.current?.canUndo() ?? false);
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };
    onChangeRef.current = commit;

    useEffect(() => {
      if (!canvas.current) return undefined;
      const signaturePad = new SignaturePad(canvas.current, {
        onChange: (next) => onChangeRef.current(next),
      });
      pad.current = signaturePad;
      if (current) void signaturePad.load(current);
      emitted.current = current;
      return () => {
        signaturePad.destroy();
        pad.current = null;
      };
      // The pad keeps its own drawing; external values are loaded below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      pad.current?.setDisabled(disabled);
    }, [disabled]);

    // A value set from outside (cleared, or loaded) replaces the drawing.
    useEffect(() => {
      if (current === emitted.current) return;
      emitted.current = current;
      setTyped('');
      setCanUndo(false);
      void pad.current?.load(current);
    }, [current]);

    const choose = (next: SignatureMode) => {
      if (next === mode || disabled) return;
      setMode(next);
      setTyped('');
      pad.current?.clear(true);
      if (current !== '') commit('');
      requestAnimationFrame(() => {
        pad.current?.resize();
        if (next === 'type') typedInput.current?.focus();
      });
    };

    const type = (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setTyped(text);
      const style = getComputedStyle(event.target);
      commit(
        renderTypedSignature(text, {
          font: style.font || '40px cursive',
          color: style.color || '#000',
        }),
      );
    };

    const upload = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file || !pad.current) return;
      try {
        pad.current.setImage(await readSignatureImage(file));
      } catch {
        // Not an image: nothing changes.
      }
    };

    const clear = () => {
      setTyped('');
      pad.current?.clear(true);
      if (current !== '') commit('');
      setAnnouncement('');
      requestAnimationFrame(() => setAnnouncement(t.cleared));
    };

    return (
      <div
        {...rest}
        ref={ref}
        id={id}
        className={cx('apui-signature', classes.root, className)}
        role="group"
        aria-labelledby={hasLabel ? `${id}-label` : undefined}
        aria-label={hasLabel ? undefined : t.pad}
        aria-describedby={describedBy}
        data-mode={mode}
        data-pen-color={penColor}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        {hasLabel ? (
          <span
            className={classes.label}
            data-scope="signature"
            data-part="label"
            id={`${id}-label`}
          >
            {label}
            {required ? (
              <span
                className={classes.required}
                data-scope="signature"
                data-part="required"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
          </span>
        ) : null}
        <div
          className={classes.modes}
          data-scope="signature"
          data-part="modes"
          role="group"
          aria-label={t.modes}
          id={`${id}-modes`}
        >
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              className={classes.mode}
              data-scope="signature"
              data-part="mode"
              data-value={item}
              id={`${id}-mode-${item}`}
              aria-pressed={item === mode}
              disabled={disabled || undefined}
              onClick={() => choose(item)}
            >
              {t[item]}
            </button>
          ))}
        </div>
        <div className={classes.pad} data-scope="signature" data-part="pad" id={`${id}-pad`}>
          <span
            className={classes.line}
            data-scope="signature"
            data-part="line"
            aria-hidden="true"
          />
          <span className={classes.mark} data-scope="signature" data-part="mark" aria-hidden="true">
            ×
          </span>
          <canvas
            ref={canvas}
            className={classes.ink}
            data-scope="signature"
            data-part="ink"
            id={`${id}-ink`}
            role="img"
            aria-label={t.pad}
            hidden={mode === 'type'}
          />
          <input
            ref={typedInput}
            type="text"
            className={classes.typed}
            data-scope="signature"
            data-part="typed"
            id={`${id}-typed`}
            aria-label={t.typed}
            autoComplete="name"
            maxLength={255}
            value={typed}
            aria-required={required || undefined}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            disabled={disabled || undefined}
            hidden={mode !== 'type'}
            onChange={type}
          />
          {modes.includes('upload') ? (
            <label
              className={classes.upload}
              data-scope="signature"
              data-part="upload"
              id={`${id}-upload`}
              hidden={mode !== 'upload' || !isEmpty}
            >
              <input
                type="file"
                accept="image/*"
                disabled={disabled || undefined}
                onChange={(event) => void upload(event)}
              />
              <IconSvg name="upload" />
              <span>{t.uploadTrigger}</span>
            </label>
          ) : null}
          <div
            className={classes.tools}
            data-scope="signature"
            data-part="tools"
            id={`${id}-tools`}
            hidden={mode === 'type'}
          >
            <button
              type="button"
              className={classes.undo}
              data-scope="signature"
              data-part="undo"
              id={`${id}-undo`}
              aria-label={t.undo}
              disabled={!canUndo || disabled}
              hidden={mode !== 'draw'}
              onClick={() => pad.current?.undo()}
            >
              <IconSvg name="undo-2" />
            </button>
            <button
              type="button"
              className={classes.clear}
              data-scope="signature"
              data-part="clear"
              id={`${id}-clear`}
              disabled={isEmpty || disabled}
              onClick={clear}
            >
              <IconSvg name="eraser" />
              <span>{t.clear}</span>
            </button>
          </div>
          <span
            className={classes.placeholder}
            data-scope="signature"
            data-part="placeholder"
            aria-hidden="true"
          >
            {placeholder || t.placeholder}
          </span>
        </div>
        <input type="hidden" name={name} value={current} />
        {hasHint ? (
          <p className={classes.hint} data-scope="signature" data-part="hint" id={`${id}-hint`}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p className={classes.error} data-scope="signature" data-part="error" id={`${id}-error`}>
            <IconSvg name="circle-alert" />
            {error}
          </p>
        ) : null}
        <span
          className="apui-sr-only"
          data-scope="signature"
          data-part="status"
          id={`${id}-status`}
          role="status"
          aria-live="polite"
        >
          {announcement}
        </span>
      </div>
    );
  },
);

Signature.displayName = 'Signature';
