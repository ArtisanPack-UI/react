/**
 * @module Chart
 *
 * The design-system Chart (#63): a bar, line, area or donut chart in a Card,
 * rendering the `.apui-card.apui-chart` markup contract styled by
 * `@artisanpack-ui/css`. The geometry comes from the behavior package's
 * `chartGeometry`, the same one Blade and Vue draw: no chart library. The
 * behavior package's `attachChartTooltip` opens the tooltip on hover and
 * keyboard focus of each mark. The plot stays LTR (D-004).
 *
 * @packageDocumentation
 */

import {
  attachChartTooltip,
  CHART_HEIGHT,
  CHART_TYPES,
  CHART_WIDTH,
  chartGeometry,
  type ChartNotation,
  type ChartSeriesInput,
  type ChartType,
} from '@artisanpack-ui/behavior';
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';

import { cx, hasContent, type PartClasses } from '../../../internal/parts';

export type { ChartNotation, ChartType };

/** One named series; `data` lines up with `labels`. */
export type ChartSeries = ChartSeriesInput;

/** The parts a {@link Chart} accepts extra classes for. */
export type ChartPart =
  | 'root'
  | 'header'
  | 'title'
  | 'description'
  | 'actions'
  | 'legend'
  | 'swatch'
  | 'body'
  | 'plot'
  | 'grid'
  | 'axis'
  | 'mark'
  | 'line'
  | 'area'
  | 'point'
  | 'crosshair'
  | 'dot'
  | 'value'
  | 'tooltip'
  | 'table';

/** Props for the {@link Chart} component. Native `<div>` attributes go to the root. */
export interface ChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Bars (the first series), lines, lines with a fill, or a donut. @defaultValue `'bar'` */
  type?: ChartType;
  /** `[{ name, data }]`, or a plain array of values for one series named by `title`. */
  series: readonly ChartSeries[] | readonly (number | null)[];
  /** The categories: x-axis labels, or the donut's slices. */
  labels?: readonly string[];
  /** The heading; it names the plot and the table. */
  title: string;
  /** Supporting text under the title. */
  description?: string;
  /** Controls at the end of the header, such as Tabs. */
  actions?: ReactNode;
  /** Shows the data table under the plot (the spec's `showTable`). @defaultValue `false` */
  tabular?: boolean;
  /** Printed before every value, such as `$`. */
  prefix?: string;
  /** Printed after every value, such as `%`. */
  suffix?: string;
  /** `standard` (12,500) or `compact` ($12.5k). @defaultValue `'standard'` */
  notation?: ChartNotation;
  /** The plot's viewBox width. @defaultValue `520` */
  width?: number;
  /** The plot's viewBox height. @defaultValue `220` */
  height?: number;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ChartPart>;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * A bar, line, area or donut chart. The ref points at the root `<div>`.
 *
 * @example
 * ```tsx
 * <Chart
 *   type="bar"
 *   title="Weekly revenue"
 *   labels={['W1', 'W2', 'W3']}
 *   series={[{ name: 'Revenue', data: [4100, 6000, 8200] }]}
 *   prefix="$"
 *   notation="compact"
 * />
 * ```
 */
export const Chart = forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      type = 'bar',
      series,
      labels,
      title,
      description,
      actions,
      tabular = false,
      prefix,
      suffix,
      notation = 'standard',
      width = CHART_WIDTH,
      height = CHART_HEIGHT,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const shown: ChartType = CHART_TYPES.includes(type) ? type : 'bar';
    const geometry = useMemo(
      () =>
        chartGeometry(series, {
          type: shown,
          labels,
          width,
          height,
          title,
          prefix,
          suffix,
          notation: notation === 'compact' ? 'compact' : 'standard',
        }),
      [series, shown, labels, width, height, title, prefix, suffix, notation],
    );

    const root = useRef<HTMLDivElement | null>(null);
    const setRoot = useCallback(
      (element: HTMLDivElement | null) => {
        root.current = element;
        assignRef(ref, element);
      },
      [ref],
    );
    useEffect(() => (root.current ? attachChartTooltip(root.current) : undefined), []);

    const donut = shown === 'donut';
    const named = title ? title : undefined;
    const legend = (
      <ul className={classes.legend} data-scope="chart" data-part="legend">
        {geometry.legend.map((item, index) => (
          <li key={index}>
            <span
              className={classes.swatch}
              data-scope="chart"
              data-part="swatch"
              data-series={item.series}
              aria-hidden="true"
            />
            {item.name}
            {item.value !== null ? (
              <span className={classes.value} data-scope="chart" data-part="value">
                {item.value}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );

    return (
      <div
        {...rest}
        ref={setRoot}
        className={cx('apui-card apui-chart', classes.root, className)}
        data-type={shown}
      >
        <div className={classes.header} data-scope="chart" data-part="header">
          <div>
            {title ? (
              <h3 className={classes.title} data-scope="chart" data-part="title">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className={classes.description} data-scope="chart" data-part="description">
                {description}
              </p>
            ) : null}
          </div>
          {!donut && geometry.legend.length > 0 ? legend : null}
          {hasContent(actions) ? (
            <div className={classes.actions} data-scope="chart" data-part="actions">
              {actions}
            </div>
          ) : null}
        </div>
        <div className={classes.body} data-scope="chart" data-part="body">
          <svg
            className={classes.plot}
            data-scope="chart"
            data-part="plot"
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            width={geometry.width}
            height={geometry.height}
            role="group"
            aria-label={named}
          >
            {!donut ? (
              <>
                <g aria-hidden="true">
                  {geometry.ticks.map((tick, index) => (
                    <Fragment key={`tick-${index}`}>
                      <line
                        className={classes.grid}
                        data-scope="chart"
                        data-part="grid"
                        x1={geometry.left}
                        x2={geometry.right}
                        y1={tick.y}
                        y2={tick.y}
                      />
                      <text
                        className={classes.axis}
                        data-scope="chart"
                        data-part="axis"
                        x={geometry.tickX}
                        y={tick.textY}
                        textAnchor="end"
                      >
                        {tick.label}
                      </text>
                    </Fragment>
                  ))}
                  {geometry.categories.map((category, index) => (
                    <text
                      key={`category-${index}`}
                      className={classes.axis}
                      data-scope="chart"
                      data-part="axis"
                      x={category.x}
                      y={geometry.labelY}
                      textAnchor="middle"
                    >
                      {category.label}
                    </text>
                  ))}
                </g>
                {geometry.lines.length > 0 ? (
                  <>
                    <g aria-hidden="true">
                      {geometry.areas.map((area, index) => (
                        <path
                          key={`area-${index}`}
                          className={classes.area}
                          data-scope="chart"
                          data-part="area"
                          data-series={area.series}
                          d={area.d}
                        />
                      ))}
                      {geometry.lines.map((line, index) => (
                        <path
                          key={`line-${index}`}
                          className={classes.line}
                          data-scope="chart"
                          data-part="line"
                          data-series={line.series}
                          d={line.d}
                        />
                      ))}
                    </g>
                    <g aria-hidden="true">
                      {geometry.points.map((point) => (
                        <g
                          key={point.index}
                          className={classes.point}
                          data-scope="chart"
                          data-part="point"
                          data-index={point.index}
                          visibility="hidden"
                        >
                          <line
                            className={classes.crosshair}
                            data-scope="chart"
                            data-part="crosshair"
                            x1={point.x}
                            x2={point.x}
                            y1={point.top}
                            y2={point.bottom}
                          />
                          {point.dots.map((dot, dotIndex) => (
                            <circle
                              key={dotIndex}
                              className={classes.dot}
                              data-scope="chart"
                              data-part="dot"
                              data-series={dot.series}
                              cx={dot.cx}
                              cy={dot.cy}
                              r="5"
                            />
                          ))}
                        </g>
                      ))}
                    </g>
                  </>
                ) : null}
                {geometry.value !== null ? (
                  <text
                    className={classes.value}
                    data-scope="chart"
                    data-part="value"
                    x={geometry.value.x}
                    y={geometry.value.y}
                    textAnchor="middle"
                    aria-hidden="true"
                  >
                    {geometry.value.text}
                  </text>
                ) : null}
              </>
            ) : null}
            {geometry.marks.map((mark) => {
              const shared = {
                className: classes.mark,
                'data-scope': 'chart',
                'data-part': 'mark',
                'data-series': mark.series,
                'data-index': mark.index,
                tabIndex: 0,
                role: 'img',
                'aria-label': mark.label,
                'data-tooltip-title': mark.title,
                'data-tooltip-body': mark.body,
                'data-anchor-x': mark.anchorX,
                'data-anchor-y': mark.anchorY,
              };
              return mark.shape === 'rect' ? (
                <rect
                  key={mark.index}
                  {...shared}
                  x={mark.x}
                  y={mark.y}
                  width={mark.width}
                  height={mark.height}
                />
              ) : (
                <path key={mark.index} {...shared} d={mark.d} />
              );
            })}
          </svg>
          {donut ? legend : null}
          <div
            className={classes.tooltip}
            data-scope="chart"
            data-part="tooltip"
            aria-hidden="true"
            hidden
          />
        </div>
        {tabular ? (
          <table className={classes.table} data-scope="chart" data-part="table" aria-label={named}>
            <thead>
              <tr>
                {geometry.table.columns.map((column, index) =>
                  index === 0 ? (
                    <td key={index} />
                  ) : (
                    <th key={index} scope="col">
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {geometry.table.rows.map((row, index) => (
                <tr key={index}>
                  <th scope="row">{row.label}</th>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  },
);

Chart.displayName = 'Chart';
