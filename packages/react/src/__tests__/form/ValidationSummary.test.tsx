import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  ValidationSummary,
  normalizeValidationErrors,
  type ValidationSummaryProps,
} from '../../components/form/ValidationSummary/ValidationSummary';

const declaredProps: (keyof ValidationSummaryProps)[] = ['errors', 'color', 'title', 'classes'];

const errors = [
  { field: 'postal-code', message: 'Spanish postal codes have 5 digits.' },
  { field: 'terms', message: 'Accept the listing terms.' },
];

describe('ValidationSummary', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ValidationSummary, 'ValidationSummary', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders an alert with linked errors and takes focus', () => {
    const { container } = render(<ValidationSummary errors={errors} />);
    const root = screen.getByRole('alert');
    expect(root).toHaveClass('apui-validation-summary');
    expect(root).toHaveAttribute('data-color', 'error');
    expect(root).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(root);
    expect(
      [...container.querySelectorAll('[data-scope="validation-summary"]')].map((el) =>
        el.getAttribute('data-part'),
      ),
    ).toEqual(['icon', 'title', 'list', 'item', 'link', 'item', 'link']);
    expect(screen.getByText('Fix 2 fields')).toHaveAttribute('data-part', 'title');
    expect(screen.getByRole('link', { name: 'Accept the listing terms.' })).toHaveAttribute(
      'href',
      '#terms',
    );
  });

  it('renders nothing without errors', () => {
    const { container } = render(<ValidationSummary errors={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('is a status without focus for warnings', () => {
    render(<ValidationSummary color="warning" errors={{ description: ['Too short.', 'Other'] }} />);
    const root = screen.getByRole('status');
    expect(root).not.toHaveAttribute('tabindex');
    expect(document.activeElement).not.toBe(root);
    expect(screen.getByText('1 recommendation')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('normalizes a map to the first message per field', () => {
    expect(normalizeValidationErrors({ a: ['One', 'Two'], b: 'Three', c: undefined })).toEqual([
      { field: 'a', message: 'One' },
      { field: 'b', message: 'Three' },
    ]);
  });

  it('moves focus to the field by id, name or wire:model', () => {
    render(
      <>
        <input id="postal-code" aria-label="Postal" />
        <input name="terms" aria-label="Terms" type="checkbox" />
        <ValidationSummary
          errors={[...errors, { field: 'email', message: 'Bad email.' }]}
          title="Fix these"
        />
      </>,
    );
    const wired = document.createElement('input');
    wired.setAttribute('wire:model.live', 'email');
    document.body.append(wired);

    fireEvent.click(screen.getByRole('link', { name: 'Spanish postal codes have 5 digits.' }));
    expect(document.activeElement).toBe(screen.getByLabelText('Postal'));
    fireEvent.click(screen.getByRole('link', { name: 'Accept the listing terms.' }));
    expect(document.activeElement).toBe(screen.getByLabelText('Terms'));
    fireEvent.click(screen.getByRole('link', { name: 'Bad email.' }));
    expect(document.activeElement).toBe(wired);
    wired.remove();
  });
});
