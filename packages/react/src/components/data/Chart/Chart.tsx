/**
 * @module Chart
 *
 * Charting component powered by ApexCharts (via react-apexcharts). Supports bar, line,
 * area, donut, pie, radialBar, radar, and polarArea chart types. Accepts data as either
 * simple data points or multi-series arrays, with DaisyUI color integration and
 * deep-mergeable ApexCharts options.
 */

import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import ReactApexChart from 'react-apexcharts';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import type { ApexOptions } from 'apexcharts';

/**
 * A single data point for simple chart types (pie, donut, single-series bar/line).
 */
export interface ChartDataPoint {
  /** Label for this data point (used as x-axis category or pie slice label). */
  label: string;
  /** Numeric value for this data point. */
  value: number;
  /** DaisyUI color name or CSS color string for this data point. */
  color?: DaisyColor | string;
}

/**
 * A named data series for multi-series chart types (bar, line, area).
 */
export interface ChartSeries {
  /** Display name for the series (shown in legend and tooltips). */
  name: string;
  /** Array of numeric values for this series. */
  data: number[];
  /** DaisyUI color name or CSS color string for this series. */
  color?: DaisyColor | string;
}

/**
 * Supported chart type identifiers for the {@link Chart} component.
 */
export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'donut'
  | 'pie'
  | 'radialBar'
  | 'radar'
  | 'polarArea';

/**
 * Props for the {@link Chart} component.
 */
export interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  /** The type of chart to render. */
  type: ChartType;
  /** Category labels for the x-axis or pie/donut slices. Falls back to `data[].label` if not provided. */
  labels?: string[];
  /** Multi-series data for bar, line, and area charts. */
  series?: ChartSeries[];
  /** Simple data points for single-series or pie/donut charts. */
  data?: ChartDataPoint[];
  /** Chart height in pixels or CSS string. @defaultValue 350 */
  height?: number | string;
  /** Chart width in pixels or CSS string. */
  width?: number | string;
  /** Default DaisyUI color applied to all series/data points without an explicit color. */
  color?: DaisyColor;
  /** ApexCharts options object, deep-merged with the component's defaults. */
  options?: ApexOptions;
  /** Whether to show the chart legend. @defaultValue true */
  showLegend?: boolean;
  /** Whether to enable chart animations. @defaultValue true */
  animated?: boolean;
  /** Optional title displayed above the chart. */
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

/**
 * Chart component powered by ApexCharts with DaisyUI color integration.
 *
 * Supports both simple data points and multi-series data. Automatically resolves
 * DaisyUI color names to hex values and deep-merges user-provided ApexCharts options
 * with sensible defaults.
 *
 * @example
 * ```tsx
 * // Pie chart with simple data
 * <Chart
 *   type="pie"
 *   data={[
 *     { label: 'Desktop', value: 60, color: 'primary' },
 *     { label: 'Mobile', value: 30, color: 'secondary' },
 *     { label: 'Tablet', value: 10, color: 'accent' },
 *   ]}
 * />
 *
 * // Multi-series line chart
 * <Chart
 *   type="line"
 *   labels={['Jan', 'Feb', 'Mar']}
 *   series={[
 *     { name: 'Sales', data: [10, 20, 30], color: 'primary' },
 *     { name: 'Returns', data: [5, 3, 8], color: 'error' },
 *   ]}
 * />
 * ```
 */
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

/**
 * Recursively deep-merges two plain objects. Arrays and non-object values
 * in `source` overwrite those in `target`.
 *
 * @param target - The base object to merge into.
 * @param source - The object whose values take precedence.
 * @returns A new merged object.
 */
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
