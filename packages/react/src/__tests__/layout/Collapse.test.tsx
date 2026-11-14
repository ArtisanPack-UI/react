import { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Collapse, type CollapseProps } from '../../components/layout/Collapse/Collapse';

const declaredProps: (keyof CollapseProps)[] = [
  'open',
  'defaultOpen',
  'variant',
  'label',
  'openLabel',
  'disabled',
  'classes',
];

const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('Collapse', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Collapse, 'Collapse', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
      // openLabel only shows while open; the open-state tests below cover it.
      ignoreEffects: ['openLabel'],
    });
  });

  it('renders a section: trigger, then a hidden region', () => {
    const { container } = render(<Collapse label="Advanced settings">Body</Collapse>);
    const root = container.querySelector('.apui-collapse')!;
    expect(root.getAttribute('data-scope')).toBe('collapse');
    expect(root.getAttribute('data-variant')).toBe('section');
    const button = screen.getByRole('button', { name: 'Advanced settings' });
    expect(button.getAttribute('data-part')).toBe('trigger');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.querySelector('[data-part="icon"]')?.getAttribute('aria-hidden')).toBe('true');
    const content = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(content.getAttribute('data-part')).toBe('content');
    expect(content.hidden).toBe(true);
    expect(button.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('toggles and reports open-change when uncontrolled', async () => {
    const onOpenChange = vi.fn();
    render(
      <Collapse label="More" onOpenChange={onOpenChange}>
        Body
      </Collapse>,
    );
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'More' })));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'More' }).getAttribute('aria-expanded')).toBe('true');
  });

  it('follows a controlled open prop', async () => {
    const { rerender } = render(
      <Collapse label="More" open={false}>
        Body
      </Collapse>,
    );
    rerender(
      <Collapse label="More" open>
        Body
      </Collapse>,
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'More' }).getAttribute('aria-expanded')).toBe(
        'true',
      ),
    );
  });

  it('clamps a read-more instead of hiding it, with the trigger after and the fade', async () => {
    const { container } = render(<Collapse variant="read-more">Long text</Collapse>);
    const button = screen.getByRole('button', { name: 'Read more' });
    const content = container.querySelector('[data-part="content"]') as HTMLElement;
    expect(content.hidden).toBe(false);
    expect(content.querySelector('[data-part="fade"]')?.getAttribute('aria-hidden')).toBe('true');
    expect(content.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await interact(() => fireEvent.click(button));
    expect(screen.getByRole('button', { name: 'Show less' })).toBeTruthy();
  });

  it('disables the trigger', () => {
    render(
      <Collapse label="More" disabled>
        Body
      </Collapse>,
    );
    expect((screen.getByRole('button', { name: 'More' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('sets classes per part and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Collapse ref={ref} label="More" classes={{ root: 'r', trigger: 't' }}>
        Body
      </Collapse>,
    );
    expect(ref.current).toBe(container.querySelector('.apui-collapse'));
    expect(ref.current?.className).toBe('apui-collapse r');
    expect(screen.getByRole('button', { name: 'More' }).className).toBe('t');
  });
});
