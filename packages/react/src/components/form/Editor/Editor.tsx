/**
 * @module Editor
 *
 * Deprecated alias of {@link CodeEditor}, kept for 1.x code. Editor's props
 * (`label`, `hint`, `error`, `value`, `onChange`, `rows` and the native
 * textarea attributes) are a subset of CodeEditor's, so they carry over
 * unchanged.
 *
 * @deprecated Use `CodeEditor`.
 * @packageDocumentation
 */

import { forwardRef } from 'react';

import { devWarnOnce } from '../../../internal/parts';
import { CodeEditor, type CodeEditorProps } from '../CodeEditor/CodeEditor';

/**
 * Props for the deprecated {@link Editor}.
 *
 * @deprecated Use `CodeEditorProps`.
 */
export type EditorProps = CodeEditorProps;

/**
 * Deprecated: renders a {@link CodeEditor}. The ref points at the textarea.
 *
 * @deprecated Use `CodeEditor`.
 */
export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>((props, ref) => {
  devWarnOnce('Editor', 'Editor is deprecated; use CodeEditor.');
  return <CodeEditor {...props} ref={ref} />;
});

Editor.displayName = 'Editor';
