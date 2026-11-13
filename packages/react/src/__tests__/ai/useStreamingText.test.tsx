import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { useStreamingText } from '../../components/ai/useStreamingText';
import { deferred } from './testClient';

/** A Response whose body yields the given chunks, each read settled by the test. */
function scriptedResponse(chunks: Promise<Uint8Array | null>[]): Response {
  let index = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const next = await chunks[index++];
      if (next === null || next === undefined) {
        controller.close();
      } else {
        controller.enqueue(next);
      }
    },
  });
  return new Response(body);
}

function strictWrapper({ children }: { children: ReactNode }) {
  return <StrictMode>{children}</StrictMode>;
}

describe('useStreamingText', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('decodes a character split across chunks exactly once under StrictMode', async () => {
    const bytes = new TextEncoder().encode('héllo €');
    // Split inside the two-byte é and inside the three-byte €.
    const parts = [bytes.slice(0, 2), bytes.slice(2, 7), bytes.slice(7)];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => scriptedResponse([...parts, null].map((part) => Promise.resolve(part)))),
    );

    const { result } = renderHook(() => useStreamingText(), { wrapper: strictWrapper });
    await act(async () => {
      await result.current.start('/stream');
    });

    expect(result.current.text).toBe('héllo €');
    expect(result.current.streaming).toBe(false);
  });

  it('ignores chunks and errors from a stream that a newer start() replaced', async () => {
    const staleRead = deferred<Uint8Array | null>();
    const encoder = new TextEncoder();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(scriptedResponse([staleRead.promise]))
        .mockResolvedValueOnce(
          scriptedResponse([Promise.resolve(encoder.encode('fresh')), Promise.resolve(null)]),
        ),
    );

    const { result } = renderHook(() => useStreamingText());
    let first!: Promise<void>;
    act(() => {
      first = result.current.start('/a');
    });
    await act(async () => {
      await result.current.start('/b');
    });
    await act(async () => {
      staleRead.resolve(encoder.encode('stale'));
      await first;
    });

    expect(result.current.text).toBe('fresh');
    expect(result.current.error).toBeNull();
  });

  it("aborts the request when the caller's signal is already aborted", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      return scriptedResponse([Promise.resolve(null)]);
    });
    vi.stubGlobal('fetch', fetchMock);
    const caller = new AbortController();
    caller.abort();

    const { result } = renderHook(() => useStreamingText());
    await act(async () => {
      await result.current.start('/stream', { signal: caller.signal });
    });

    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.streaming).toBe(false);
  });

  it("aborts the stream when the caller's signal aborts mid-stream", async () => {
    const hang = deferred<Uint8Array | null>();
    let seenSignal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        seenSignal = init?.signal ?? undefined;
        return scriptedResponse([hang.promise]);
      }),
    );
    const caller = new AbortController();

    const { result } = renderHook(() => useStreamingText());
    act(() => {
      void result.current.start('/stream', { signal: caller.signal });
    });
    await waitFor(() => expect(seenSignal).toBeDefined());

    act(() => {
      caller.abort();
    });

    expect(seenSignal?.aborted).toBe(true);
    await act(async () => {
      hang.resolve(new TextEncoder().encode('late'));
    });
    await waitFor(() => expect(result.current.streaming).toBe(false));
    expect(result.current.text).toBe('');
  });
});
