import { forwardRef, useMemo, useState, useRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface SparklineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  data: number[];
  type?: 'line' | 'area' | 'bar';
  height?: number;
  width?: number;
  color?: DaisyColor | string;
  strokeWidth?: number;
  curve?: boolean;
  fillOpacity?: number;
  showTooltip?: boolean;
}

const daisyColorToVar: Record<string, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
  neutral: 'var(--color-neutral)',
};

function resolveColor(color: string): string {
  return daisyColorToVar[color] ?? color;
}

export const Sparkline = forwardRef<HTMLDivElement, SparklineProps>(
  (
    {
      data,
      type = 'line',
      height = 40,
      width,
      color = 'primary',
      strokeWidth = 2,
      curve = true,
      fillOpacity = 0.3,
      showTooltip = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const resolvedColor = resolveColor(color);
    const svgWidth = width ?? data.length * 8;
    const svgHeight = height;
    const padding = 2;

    const chartWidth = svgWidth - padding * 2;
    const chartHeight = svgHeight - padding * 2;

    const minVal = useMemo(() => (data.length > 0 ? Math.min(...data) : 0), [data]);
    const maxVal = useMemo(() => (data.length > 0 ? Math.max(...data) : 0), [data]);
    const range = maxVal - minVal || 1;

    const points = useMemo(() => {
      return data.map((value, i) => ({
        x: padding + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2),
        y: padding + chartHeight - ((value - minVal) / range) * chartHeight,
        value,
      }));
    }, [data, chartWidth, chartHeight, minVal, range]);

    const linePath = useMemo(() => {
      if (points.length === 0) return '';

      if (curve && points.length > 2) {
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[Math.max(i - 1, 0)];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = points[Math.min(i + 2, points.length - 1)];

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return path;
      }

      return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    }, [points, curve]);

    const areaPath = useMemo(() => {
      if (!linePath || type !== 'area') return '';
      const first = points[0];
      const last = points[points.length - 1];
      return `${linePath} L${last.x},${svgHeight - padding} L${first.x},${svgHeight - padding} Z`;
    }, [linePath, points, type, svgHeight]);

    if (data.length === 0) return null;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!showTooltip || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const ratio = mouseX / rect.width;
      const index = Math.round(ratio * (data.length - 1));
      setHovered(Math.max(0, Math.min(index, data.length - 1)));
    };

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center relative', className)}
        {...rest}
      >
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Sparkline chart with values: ${data.join(', ')}`}
          role="img"
        >
          {type === 'bar' ? (
            (() => {
              const barGap = 1;
              const barWidth = Math.max(1, (chartWidth - barGap * (data.length - 1)) / data.length);

              return data.map((value, i) => {
                const barHeight = Math.max(1, ((value - minVal) / range) * chartHeight);
                const x = padding + i * (barWidth + barGap);
                const y = padding + chartHeight - barHeight;
                const isHovered = hovered === i;

                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={1}
                    style={{ fill: resolvedColor, opacity: isHovered ? 1 : 0.7 }}
                  >
                    <title>{value}</title>
                  </rect>
                );
              });
            })()
          ) : (
            <>
              {type === 'area' && (
                <path
                  d={areaPath}
                  style={{ fill: resolvedColor, opacity: fillOpacity }}
                />
              )}
              <path
                d={linePath}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ stroke: resolvedColor }}
              />
              {hovered !== null && points[hovered] && (
                <circle
                  cx={points[hovered].x}
                  cy={points[hovered].y}
                  r={3}
                  strokeWidth={1.5}
                  style={{ fill: resolvedColor, stroke: 'var(--color-base-100)' }}
                />
              )}
            </>
          )}
        </svg>
        {showTooltip && hovered !== null && (
          <div
            className="absolute -top-8 bg-base-300 text-base-content text-xs px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap"
            style={{
              left: `${(hovered / Math.max(data.length - 1, 1)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {data[hovered]}
          </div>
        )}
      </div>
    );
  },
);

Sparkline.displayName = 'Sparkline';
