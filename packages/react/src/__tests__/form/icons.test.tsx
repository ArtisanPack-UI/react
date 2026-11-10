import { render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { resetIcons } from '@artisanpack-ui/behavior/icons';
import { Button, registerIcons, UnsafeIconError } from '../../index';

describe('icon registry re-exports', () => {
  afterEach(() => resetIcons());

  it('renders an icon registered through the package entry', () => {
    registerIcons({ star: '<path d="M12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9Z" />' });
    render(<Button leadingIcon="star">Star</Button>);
    const svg = screen.getByRole('button').querySelector('[data-part="icon"] svg')!;
    expect(svg.innerHTML).toContain('M12 2');
  });

  it.each([
    '<script>alert(1)</script>',
    '<path onload="alert(1)" />',
    '<a href="javascript:alert(1)"><path /></a>',
    '<use href="#x" />',
  ])('rejects the unsafe body %j with UnsafeIconError', (body) => {
    expect(() => registerIcons({ bad: body })).toThrow(UnsafeIconError);
  });
});
