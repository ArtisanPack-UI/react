import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import ReactApexChart from 'react-apexcharts';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import type { ApexOptions } from 'apexcharts';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: DaisyColor | string;
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: DaisyColor | string;
}

export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'donut'
  | 'pie'
  | 'radialBar'
  | 'radar'
  | 'polarArea';

export interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  type: ChartType;
  labels?: string[];
  series?: ChartSeries[];
  data?: ChartDataPoint[];
  height?: number | string;
  width?: number | string;
  color?: DaisyColor;
  options?: ApexOptions;
  showLegend?: boolean;
  animated?: boolean;
  title?: string;
}

const daisyToHex: Record<string, string> = {
  primary: '#6366f1',
  secondary: '#a855f7',
  accent: '#06b6d4',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  neutral: '#64748b',
};

const defaultPalette = [
  '#6366f1',
  '#f43f5e',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

function resolveColor(color: string | undefined, index: number): string {
  if (!color) return defaultPalette[index % defaultPalette.length];
  if (color in daisyToHex) return daisyToHex[color];
  return color;
}

export const Chart = forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      type,
      labels = [],
      series = [],
      data = [],
      height = 350,
      width,
      color,
      options: userOptions,
      showLegend = true,
      animated = true,
      title,
      className,
      ...rest
    },
    ref,
  ) => {
    const isPie =
      type === 'pie' || type === 'donut' || type === 'radialBar' || type === 'polarArea';

    const resolvedColors = useMemo(() => {
      if (isPie && data.length > 0) {
        return data.map((d, i) => resolveColor(d.color, i));
      }
      if (series.length > 0) {
        return series.map((s, i) => resolveColor(s.color ?? color, i));
      }
      return [resolveColor(color, 0)];
    }, [isPie, data, series, color]);

    const apexSeries = useMemo(() => {
      if (isPie) {
        if (data.length > 0) return data.map((d) => d.value);
        if (series.length > 0 && series[0]) return series[0].data;
        return [];
      }
      if (series.length > 0) {
        return series.map((s) => ({
          name: s.name,
          data: s.data,
        }));
      }
      if (data.length > 0) {
        return [{ name: 'Default', data: data.map((d) => d.value) }];
      }
      return [];
    }, [isPie, series, data]);

    const apexLabels = useMemo(() => {
      if (labels.length > 0) return labels;
      if (data.length > 0) return data.map((d) => d.label);
      return [];
    }, [labels, data]);

    const mergedOptions: ApexOptions = useMemo(() => {
      const base: ApexOptions = {
        chart: {
          toolbar: { show: false },
          animations: {
            enabled: animated,
            easing: 'easeinout',
            speed: 800,
            dynamicAnimation: { enabled: true, speed: 350 },
          },
          background: 'transparent',
        },
        colors: resolvedColors,
        legend: { show: showLegend },
        stroke: { curve: 'smooth' },
        dataLabels: { enabled: isPie },
        tooltip: { enabled: true },
        grid: { borderColor: '#e5e7eb' },
      };

      if (apexLabels.length > 0) {
        base.labels = apexLabels;
      }

      if (!isPie && apexLabels.length > 0) {
        base.xaxis = { categories: apexLabels };
      }

      if (type === 'area') {
        base.stroke = { curve: 'smooth', width: 2 };
        base.fill = {
          type: 'gradient',
          gradient: { opacityFrom: 0.4, opacityTo: 0.05 },
        };
      }

      if (userOptions) {
        return deepMerge(
          base as unknown as Record<string, unknown>,
          userOptions as unknown as Record<string, unknown>,
        ) as unknown as ApexOptions;
      }
      return base;
    }, [type, resolvedColors, apexLabels, isPie, showLegend, animated, userOptions]);

    return (
      <div ref={ref} className={cn('bg-base-100 rounded-box p-4', className)} {...rest}>
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        <ReactApexChart
          options={mergedOptions}
          series={apexSeries}
          type={type}
          height={height}
          width={width}
        />
      </div>
    );
  },
);

Chart.displayName = 'Chart';

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
): T {
  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const targetVal = result[key];
    const sourceVal = source[key];
    if (
      targetVal &&
      sourceVal &&
      typeof targetVal === 'object' &&
      typeof sourceVal === 'object' &&
      !Array.isArray(targetVal) &&
      !Array.isArray(sourceVal)
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>,
      );
    } else {
      result[key] = sourceVal;
    }
  }
  return result as T;
}
