import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface CodeProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  label?: string;
  hint?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  maxHeight?: string;
}

export const Code = forwardRef<HTMLDivElement, CodeProps>(
  (
    {
      code,
      language,
      label,
      hint,
      showLineNumbers = false,
      copyable = true,
      maxHeight,
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API may not be available
      }
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const lines = code.split('\n');

    return (
      <div ref={ref} className={cn('relative', className)} {...rest}>
        {(label || language || copyable) && (
          <div className="flex items-center justify-between bg-base-300 px-4 py-2 rounded-t-lg text-sm">
            {(label || language) && <span className="font-semibold">{label ?? language}</span>}
            {copyable && (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy code'}
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-success"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        )}
        <div
          className={cn('mockup-code', (label || language || copyable) && 'rounded-t-none')}
          style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}
        >
          {showLineNumbers ? (
            lines.map((line, i) => (
              <pre key={i} data-prefix={i + 1}>
                <code>{line}</code>
              </pre>
            ))
          ) : (
            <pre>
              <code>{code}</code>
            </pre>
          )}
        </div>
        {hint && <p className="text-sm opacity-60 mt-1">{hint}</p>}
      </div>
    );
  },
);

Code.displayName = 'Code';
