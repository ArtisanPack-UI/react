import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Chart } from '../../components/data/Chart/Chart';
import type { ChartDataPoint, ChartSeries } from '../../components/data/Chart/Chart';

// Mock react-apexcharts since ApexCharts requires a real DOM
vi.mock('react-apexcharts', () => ({
  default: (props: { options: unknown; series: unknown; type: string; height: unknown }) => (
    <div data-testid="apex-chart" data-type={props.type} data-height={String(props.height)}>
      ApexChart
    </div>
  ),
}));

const barSeries: ChartSeries[] = [{ name: 'Sales', data: [10, 20, 30, 40], color: 'primary' }];

const labels = ['Q1', 'Q2', 'Q3', 'Q4'];

const pieData: ChartDataPoint[] = [
  { label: 'Chrome', value: 60 },
  { label: 'Firefox', value: 25 },
  { label: 'Safari', value: 15 },
];

describe('Chart', () => {
  it('renders ApexChart component', () => {
    render(<Chart type="bar" series={barSeries} labels={labels} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('passes chart type to ApexChart', () => {
    render(<Chart type="line" series={barSeries} labels={labels} />);
    expect(screen.getByTestId('apex-chart')).toHaveAttribute('data-type', 'line');
  });

  it('passes height to ApexChart', () => {
    render(<Chart type="bar" series={barSeries} labels={labels} height={500} />);
    expect(screen.getByTestId('apex-chart')).toHaveAttribute('data-height', '500');
  });

  it('renders title', () => {
    render(<Chart type="bar" series={barSeries} labels={labels} title="Sales Chart" />);
    expect(screen.getByText('Sales Chart')).toBeInTheDocument();
  });

  it('renders with pie data', () => {
    render(<Chart type="pie" data={pieData} />);
    expect(screen.getByTestId('apex-chart')).toHaveAttribute('data-type', 'pie');
  });

  it('renders with donut type', () => {
    render(<Chart type="donut" data={pieData} />);
    expect(screen.getByTestId('apex-chart')).toHaveAttribute('data-type', 'donut');
  });

  it('renders with area type', () => {
    render(<Chart type="area" series={barSeries} labels={labels} />);
    expect(screen.getByTestId('apex-chart')).toHaveAttribute('data-type', 'area');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Chart type="bar" series={barSeries} labels={labels} className="custom-chart" />,
    );
    expect(container.firstChild).toHaveClass('custom-chart');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Chart ref={ref} type="bar" series={barSeries} labels={labels} />);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts custom ApexCharts options', () => {
    render(
      <Chart
        type="bar"
        series={barSeries}
        labels={labels}
        options={{ chart: { toolbar: { show: true } } }}
      />,
    );
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });
});
