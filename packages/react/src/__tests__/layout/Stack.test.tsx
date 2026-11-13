import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Stack, type StackProps } from '../../components/layout/Stack/Stack';

const declaredProps: (keyof StackProps)[] = ['orientation', 'gap', 'align', 'justify', 'wrap'];

describe('Stack', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Stack, 'Stack', { declared: { props: declaredProps, events: [] } });
  });

  it('emits its defaults as data attributes', () => {
    const { container } = render(<Stack>a</Stack>);
    const stack = container.firstElementChild!;
    expect(stack.className).toBe('apui-stack');
    expect(stack.getAttribute('data-orientation')).toBe('vertical');
    expect(stack.getAttribute('data-gap')).toBe('2');
    expect(stack.getAttribute('data-align')).toBe('stretch');
    expect(stack.getAttribute('data-justify')).toBe('start');
    expect(stack.hasAttribute('data-wrap')).toBe(false);
  });

  it('renders a wrapping row', () => {
    const { container } = render(
      <Stack orientation="horizontal" gap={4} justify="between" wrap>
        a
      </Stack>,
    );
    const stack = container.firstElementChild!;
    expect(stack.getAttribute('data-orientation')).toBe('horizontal');
    expect(stack.getAttribute('data-gap')).toBe('4');
    expect(stack.getAttribute('data-justify')).toBe('between');
    expect(stack.getAttribute('data-wrap')).toBe('');
  });

  it('still takes the deprecated direction prop', () => {
    const { container } = render(<Stack direction="horizontal">a</Stack>);
    expect(container.firstElementChild!.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('forwards the ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref} className="x" />);
    expect(ref.current?.className).toBe('apui-stack x');
  });
});
