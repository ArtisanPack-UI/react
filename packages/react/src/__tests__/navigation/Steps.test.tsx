import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Steps } from '../../components/navigation/Steps/Steps';
import type { StepItem } from '../../components/navigation/Steps/Steps';

const sampleSteps: StepItem[] = [
  { label: 'Register' },
  { label: 'Choose plan' },
  { label: 'Purchase' },
  { label: 'Complete' },
];

describe('Steps', () => {
  it('renders all step labels', () => {
    render(<Steps steps={sampleSteps} />);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Choose plan')).toBeInTheDocument();
    expect(screen.getByText('Purchase')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('renders with aria-label', () => {
    render(<Steps steps={sampleSteps} />);
    expect(screen.getByLabelText('Progress')).toBeInTheDocument();
  });

  it('marks completed steps with color class', () => {
    render(<Steps steps={sampleSteps} currentStep={1} color="primary" />);
    const items = screen.getByLabelText('Progress').querySelectorAll('.step');
    expect(items[0]).toHaveClass('step-primary');
    expect(items[1]).toHaveClass('step-primary');
    expect(items[2]).not.toHaveClass('step-primary');
  });

  it('marks current step with aria-current', () => {
    render(<Steps steps={sampleSteps} currentStep={2} />);
    const items = screen.getByLabelText('Progress').querySelectorAll('.step');
    expect(items[2]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).not.toHaveAttribute('aria-current');
  });

  it('renders vertical layout', () => {
    render(<Steps steps={sampleSteps} vertical />);
    expect(screen.getByLabelText('Progress')).toHaveClass('steps-vertical');
  });

  it('applies size class', () => {
    render(<Steps steps={sampleSteps} size="lg" />);
    expect(screen.getByLabelText('Progress')).toHaveClass('steps-lg');
  });

  it('supports per-step color override', () => {
    const steps: StepItem[] = [
      { label: 'Step 1', color: 'success' },
      { label: 'Step 2', color: 'error' },
    ];
    render(<Steps steps={steps} currentStep={1} />);
    const items = screen.getByLabelText('Progress').querySelectorAll('.step');
    expect(items[0]).toHaveClass('step-success');
    expect(items[1]).toHaveClass('step-error');
  });

  it('renders icons', () => {
    const steps: StepItem[] = [
      { label: 'Step 1', icon: <span data-testid="icon">★</span> },
    ];
    render(<Steps steps={steps} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('supports data-content attribute', () => {
    const steps: StepItem[] = [
      { label: 'Step 1', dataContent: '✓' },
    ];
    render(<Steps steps={steps} currentStep={0} color="primary" />);
    const item = screen.getByLabelText('Progress').querySelector('.step');
    expect(item).toHaveAttribute('data-content', '✓');
  });

  it('no steps are marked when currentStep is -1', () => {
    render(<Steps steps={sampleSteps} currentStep={-1} color="primary" />);
    const items = screen.getByLabelText('Progress').querySelectorAll('.step');
    items.forEach((item) => {
      expect(item).not.toHaveClass('step-primary');
    });
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Steps ref={ref} steps={sampleSteps} />);
    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Steps steps={sampleSteps} className="custom-class" />);
    expect(screen.getByLabelText('Progress')).toHaveClass('custom-class');
  });
});
