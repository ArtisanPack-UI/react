/** @module ai/useStreamingText */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Result of the {@link useStreamingText} hook.
 */
export interface UseStreamingTextResult {
  /** Accumulated text chunks received so far. */
  text: string;
  /** True while a stream is actively being consumed. */
  streaming: boolean;
  /** Populated when the stream ends with an error. */
  error: Error | null;
  /**
   * Kick off a stream from the given URL. Aborts any in-flight stream first.
   * Chunks decoded from `Response.body` are appended to `text` as they arrive.
   */
  start: (url: string, init?: RequestInit) => Promise<void>;
  /** Abort the in-flight stream, if any. */
  stop: () => void;
  /** Reset accumulated text and error state. */
  reset: () => void;
}

/**
 * Consume a long-running fetch response as a UTF-8 text stream, appending
 * decoded chunks to an accumulating `text` string on each read.
 *
 * Wraps the browser Streams API and supports abort via {@link stop} or unmount.
 * Useful for the AI usage dashboard's long-running agent output surface.
 *
 * @example
 * ```tsx
 * const { text, streaming, start, stop } = useStreamingText();
 * useEffect(() => { start('/api/artisanpack-ai/agent/stream'); }, []);
 * return <pre>{text}{streaming && '…'}</pre>;
 * ```
 */
export function useStreamingText(): UseStreamingTextResult {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setText('');
    setError(null);
  }, []);

  const start = useCallback(async (url: string, init?: RequestInit) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setText('');
    setError(null);
    setStreaming(true);

    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed with status ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      // Read until the stream closes; append decoded chunks to accumulated text.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }
      setText((prev) => prev + decoder.decode());
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err as Error);
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setStreaming(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return { text, streaming, error, start, stop, reset };
}
