/**
 * @module internal/form-reset
 *
 * Lets an uncontrolled field follow its form's reset, as Checkbox and Toggle
 * do: a reset changes the native control without a change event, so state
 * mirrored from it (Pin's cells, Textarea's counter) would go stale.
 *
 * @internal
 */

import { useEffect, useRef, type RefObject } from 'react';

type FormControl = HTMLInputElement | HTMLTextAreaElement;

/**
 * While `enabled`, a reset of the control's form calls `onReset` with the
 * control, in a later task: a native reset button resets the controls only
 * after the event's microtasks have run.
 */
export function useFormReset<T extends FormControl>(
  controlRef: RefObject<T | null>,
  enabled: boolean,
  onReset: (control: T) => void,
): void {
  const onResetRef = useRef(onReset);
  useEffect(() => {
    onResetRef.current = onReset;
  });

  useEffect(() => {
    const form = controlRef.current?.form;
    if (!enabled || !form) return;
    const handleReset = () => {
      setTimeout(() => {
        if (controlRef.current) onResetRef.current(controlRef.current);
      }, 0);
    };
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [controlRef, enabled]);
}
