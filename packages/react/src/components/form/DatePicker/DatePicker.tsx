/**
 * @module DatePicker
 *
 * The design-system DatePicker (#55): a text field with a calendar popover
 * for a single date or a range, and with `time` it's DateTime (date and time
 * in one field). It runs on the behavior engine's date-picker machine
 * (`useDatePicker`) and renders the `.apui-date-picker` markup contract
 * styled by `@artisanpack-ui/css`. Values are ISO 8601 strings.
 *
 * @packageDocumentation
 */

import {
  type DatePickerMode,
  type DatePickerValue,
  timeOptions,
  toIso,
  useDatePicker,
} from '@artisanpack-ui/behavior/react';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Button } from '../Button/Button';

export type { DatePickerMode, DatePickerValue };

/** Control height of a {@link DatePicker}. */
export type DatePickerSize = 'sm' | 'md' | 'lg';

/** The parts a {@link DatePicker} accepts extra classes for. */
export type DatePickerPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'trigger'
  | 'control'
  | 'hint'
  | 'timeZone'
  | 'error'
  | 'positioner'
  | 'content'
  | 'view'
  | 'viewControl'
  | 'prevTrigger'
  | 'rangeText'
  | 'nextTrigger'
  | 'table'
  | 'tableHead'
  | 'tableRow'
  | 'tableHeader'
  | 'tableBody'
  | 'tableCell'
  | 'tableCellTrigger'
  | 'time'
  | 'timeLabel'
  | 'timeList'
  | 'timeOption'
  | 'footer';

/** Props for the {@link DatePicker} component. Native `<input>` attributes go to the (first) text input. */
export interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'type' | 'prefix'
> {
  /** The ISO value (controlled): `2026-11-12`, `2026-11-12T11:00` with `time`, or two dates with `mode="range"`. Pair it with `onValueChange`. */
  value?: DatePickerValue;
  /** The initial value of an uncontrolled date picker. */
  defaultValue?: DatePickerValue;
  /** Called with the ISO value when a day, a time or typed text changes it. */
  onValueChange?: (value: DatePickerValue) => void;
  /** One date, or a range of two. Emitted as `data-mode`. @defaultValue `'single'` */
  mode?: DatePickerMode;
  /** Date and time (DateTime): adds the time list. Single mode only. Emitted as `data-time`. @defaultValue `false` */
  time?: boolean;
  /** Minutes between the times in the time list. @defaultValue `30` */
  step?: number;
  /** The IANA time zone, shown under the field in time mode and used for today's date. */
  timeZone?: string;
  /** BCP 47 locale for month and weekday names, the first day of the week and the default pattern. @defaultValue `'en-US'` */
  locale?: string;
  /** The earliest date that can be chosen, ISO. */
  min?: string;
  /** The latest date that can be chosen, ISO. */
  max?: string;
  /** Dates that can't be chosen, ISO. */
  disabledDates?: string[];
  /** First day of the week, 0 (Sunday) to 6. Follows the locale unless set. */
  weekStartsOn?: number;
  /** The text pattern, with `yyyy`, `MM` and `dd` (`dd.MM.yyyy`). Follows the locale unless set. */
  format?: string;
  /** Control height. Emitted as `data-size`. @defaultValue `'md'` */
  size?: DatePickerSize;
  /** The visible label, linked to the (first) input. */
  label?: ReactNode;
  /** Help text under the field. Show the expected format here. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Read-only: focusable, the calendar doesn't open. @defaultValue `false` */
  readonly?: boolean;
  /** Submits the ISO value under this name in a hidden input (two, `name[]`, in range mode). */
  name?: string;
  /** Whether the calendar is open (controlled). Pair it with `onOpenChange`. Emitted as `data-state`. */
  open?: boolean;
  /** The initial state of an uncontrolled popover. @defaultValue `false` */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes itself. Setting `open` doesn't call it. */
  onOpenChange?: (open: boolean) => void;
  /** Renders the popover at the end of the body (a React portal). Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** A row under the calendar, such as a summary and an Apply button. */
  footer?: ReactNode;
  /** The calendar button's accessible name. Translate it. @defaultValue `'Choose date'` (`'Choose date and time'` with `time`) */
  triggerLabel?: string;
  /** The previous-month button's name. @defaultValue `'Previous month'` */
  previousLabel?: string;
  /** The next-month button's name. @defaultValue `'Next month'` */
  nextLabel?: string;
  /** The popover's name. @defaultValue `'Calendar'` */
  calendarLabel?: string;
  /** The time list's name and heading. @defaultValue `'Time'` */
  timeLabel?: string;
  /** The end input's name in range mode. @defaultValue `'End date'` */
  endLabel?: string;
  /** The time-zone line; `{zone}` stands for the zone. @defaultValue `'Time zone: {zone}'` */
  timeZoneLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<DatePickerPart>;
}

/**
 * A text field with a calendar popover for a single date or a range, and
 * with `time` a date and time. Typing a date always works; the calendar is an
 * aid. The ref points at the (first) native `<input>`.
 *
 * @example
 * ```tsx
 * const [moveIn, setMoveIn] = useState<DatePickerValue>(null);
 * <DatePicker label="Move-in date" hint="MM/DD/YYYY" value={moveIn} onValueChange={setMoveIn} />
 * ```
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      mode = 'single',
      time = false,
      step = 30,
      timeZone,
      locale = 'en-US',
      min,
      max,
      disabledDates,
      weekStartsOn,
      format,
      size = 'md',
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      readonly,
      readOnly,
      required = false,
      placeholder,
      name,
      open,
      defaultOpen,
      onOpenChange,
      portal = true,
      footer,
      triggerLabel,
      previousLabel = 'Previous month',
      nextLabel = 'Next month',
      calendarLabel = 'Calendar',
      timeLabel = 'Time',
      endLabel = 'End date',
      timeZoneLabel = 'Time zone: {zone}',
      classes = {},
      className,
      id: explicitId,
      'aria-describedby': callerDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const isReadonly = readonly ?? readOnly ?? false;
    const isInvalid = invalid || Boolean(error);
    const isRange = mode === 'range';
    const hasTime = time && !isRange;
    const zoneText = hasTime && timeZone ? timeZoneLabel.replace('{zone}', timeZone) : undefined;
    const { id, helpId, errorId } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      undefined,
    );
    const zoneId = zoneText ? `${id}-time-zone` : undefined;
    const describedBy =
      [helpId, zoneId, errorId, callerDescribedBy].filter(Boolean).join(' ') || undefined;

    const api = useDatePicker({
      id,
      ids: {
        root: `${id}-root`,
        control: `${id}-box`,
        trigger: `${id}-trigger`,
        positioner: `${id}-positioner`,
        content: `${id}-content`,
        input: (index) => (index ? `${id}-${index}` : id),
        label: () => `${id}-label`,
        prevTrigger: () => `${id}-prev-trigger`,
        nextTrigger: () => `${id}-next-trigger`,
        table: () => `${id}-table`,
      },
      value,
      defaultValue,
      onValueChange: (details) => onValueChange?.(details.value),
      open,
      defaultOpen,
      onOpenChange: (details) => onOpenChange?.(details.open),
      mode,
      time: hasTime,
      locale,
      timeZone,
      min,
      max,
      disabledDates,
      weekStartsOn,
      format,
      disabled,
      readOnly: isReadonly,
      required,
      invalid: isInvalid,
      placeholder,
      labels: {
        trigger: triggerLabel ?? (hasTime ? 'Choose date and time' : 'Choose date'),
        previous: previousLabel,
        next: nextLabel,
        calendar: calendarLabel,
      },
    });

    const iso = api.value.map((date) => toIso(date, hasTime));

    return (
      <div
        {...api.getRootProps()}
        className={cx('apui-date-picker', classes.root, className)}
        data-size={size}
        data-mode={mode}
        data-time={flag(hasTime)}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-readonly={flag(isReadonly)}
      >
        <FieldLabel
          scope="date-picker"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div {...api.getControlProps()} className={classes.box}>
          <button {...api.getTriggerProps()} className={classes.trigger}>
            <IconSvg name={hasTime ? 'calendar-days' : 'calendar'} />
          </button>
          <input
            {...mergePartProps(rest, api.getInputProps({ index: 0 }))}
            ref={ref}
            className={classes.control}
            aria-describedby={describedBy}
          />
          {isRange ? (
            <>
              <span aria-hidden="true">–</span>
              <input
                {...api.getInputProps({ index: 1 })}
                className={classes.control}
                aria-label={endLabel}
                aria-describedby={describedBy}
              />
            </>
          ) : null}
        </div>
        {name !== undefined && name !== '' ? (
          isRange ? (
            <>
              <input type="hidden" name={`${name}[]`} value={iso[0] ?? ''} />
              <input type="hidden" name={`${name}[]`} value={iso[1] ?? ''} />
            </>
          ) : (
            <input type="hidden" name={name} value={iso[0] ?? ''} />
          )
        ) : null}
        <FieldHelp scope="date-picker" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        {zoneText ? (
          <p
            className={classes.timeZone}
            data-scope="date-picker"
            data-part="time-zone"
            id={zoneId}
          >
            {zoneText}
          </p>
        ) : null}
        <FieldError scope="date-picker" id={errorId} message={error} className={classes.error} />
        <Portal enabled={portal}>
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div {...api.getContentProps()} className={classes.content} data-time={flag(hasTime)}>
              <div {...api.getViewProps()} className={classes.view}>
                <div {...api.getViewControlProps()} className={classes.viewControl}>
                  <Button
                    {...api.getPrevTriggerProps()}
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    iconOnly
                    leadingIcon="chevron-left"
                    aria-label={previousLabel}
                    className={classes.prevTrigger}
                  />
                  <span {...api.getRangeTextProps()} className={classes.rangeText}>
                    {api.visibleRangeText.start}
                  </span>
                  <Button
                    {...api.getNextTriggerProps()}
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    iconOnly
                    leadingIcon="chevron-right"
                    aria-label={nextLabel}
                    className={classes.nextTrigger}
                  />
                </div>
                <table {...api.getTableProps()} className={classes.table}>
                  <thead {...api.getTableHeadProps()} className={classes.tableHead}>
                    <tr {...api.getTableRowProps()} className={classes.tableRow}>
                      {api.weekDays.map((weekDay, index) => (
                        <th
                          key={index}
                          {...api.getTableHeaderProps()}
                          scope="col"
                          abbr={weekDay.long}
                          className={classes.tableHeader}
                        >
                          {weekDay.short}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody {...api.getTableBodyProps()} className={classes.tableBody}>
                    {api.weeks.map((week, row) => (
                      <tr key={row} {...api.getTableRowProps()} className={classes.tableRow}>
                        {week.map((day) => (
                          <td
                            key={toIso(day)}
                            {...api.getDayTableCellProps({ value: day })}
                            className={classes.tableCell}
                          >
                            <div
                              {...api.getDayTableCellTriggerProps({ value: day })}
                              className={classes.tableCellTrigger}
                            >
                              {day.day}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasTime ? (
                <div className={classes.time} data-scope="date-picker" data-part="time">
                  <span
                    className={classes.timeLabel}
                    data-scope="date-picker"
                    data-part="time-label"
                    aria-hidden="true"
                  >
                    {timeLabel}
                  </span>
                  <div
                    {...api.getTimeListProps({ label: timeLabel, id: `${id}-time-list` })}
                    className={classes.timeList}
                  >
                    {timeOptions(step).map((option) => (
                      <div
                        key={option.value}
                        {...api.getTimeOptionProps({
                          value: option.value,
                          step,
                          id: `${id}-time-${option.value.replace(':', '')}`,
                        })}
                        className={classes.timeOption}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {hasContent(footer) ? (
                <div className={classes.footer} data-scope="date-picker" data-part="footer">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        </Portal>
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
