import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Diff, type DiffProps } from '../../components/data/Diff/Diff';

const declaredProps: (keyof DiffProps)[] = [
  'oldContent',
  'newContent',
  'fileName',
  'view',
  'wordLevel',
  'context',
  'countsLabel',
  'emptyLabel',
  'actions',
  'classes',
];

const OLD =
  '{\n  price: 220000,\n  rent: 1600,\n  currency: "USD",\n  available: "2027-01-01",\n}\n';
const NEW =
  '{\n  price: 220000,\n  rent: 1650,\n  deposit: 3300,\n  currency: "USD",\n  available: "2027-01-15",\n}\n';

describe('Diff', () => {
  it('matches the design-system manifest', async () => {
    // emptyLabel shows only when nothing changed.
    await expectReactParity(Diff, 'Diff', {
      declared: { props: declaredProps, events: [] },
      ignoreEffects: ['emptyLabel'],
    });
  });

  it('renders the header with hidden counts in words', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Diff ref={ref} oldContent={OLD} newContent={NEW} fileName="listings/grove.json" />,
    );
    const root = container.firstElementChild!;
    expect(ref.current).toBe(root);
    expect(root.className).toBe('apui-diff');
    expect(root.getAttribute('data-view')).toBe('unified');
    expect(
      root.querySelector('[data-part="header"] > [data-part="icon"][aria-hidden="true"] > svg'),
    ).not.toBeNull();
    expect(root.querySelector('[data-part="file"]')).toHaveTextContent('listings/grove.json');
    const counts = root.querySelector('[data-part="counts"]')!;
    expect(counts.querySelector('.apui-sr-only')).toHaveTextContent('3 additions, 2 deletions');
    expect(counts.querySelector('[data-type="add"][aria-hidden="true"]')!.textContent).toBe('+3');
    expect(counts.querySelector('[data-type="del"][aria-hidden="true"]')!.textContent).toBe('−2');
  });

  it('renders unified rows with both line numbers, a sign and word marks', () => {
    const { container } = render(<Diff oldContent={OLD} newContent={NEW} />);
    const rows = container.querySelectorAll('table[data-part="table"] > tbody > tr');
    expect(rows[0]!.getAttribute('data-part')).toBe('hunk');
    expect(rows[0]!.textContent).toBe('@@ -1,6 +1,7 @@');
    expect(rows[0]!.querySelector('td')!.getAttribute('colspan')).toBe('4');
    const removed = container.querySelector('tr[data-part="line"][data-type="del"]')!;
    const cells = removed.querySelectorAll('td');
    expect([...cells].map((cell) => cell.textContent)).toEqual(['3', '', '−', '  rent: 1600,']);
    expect(cells[3]!.getAttribute('data-type')).toBe('del');
    expect(cells[3]!.querySelector('del[data-part="del"]')!.textContent).toBe('1600');
    expect(container.querySelector('ins[data-part="ins"]')!.textContent).toBe('1650');
  });

  it('pairs the old side with the new in split view', () => {
    const { container } = render(<Diff oldContent={OLD} newContent={NEW} view="split" />);
    expect(container.firstElementChild!.getAttribute('data-view')).toBe('split');
    expect(container.querySelector('tr[data-part="hunk"] > td')!.getAttribute('colspan')).toBe('6');
    const row = container.querySelectorAll('tr[data-part="line"]')[3]!;
    expect(
      [...row.querySelectorAll('td')].map(
        (cell) => `${cell.getAttribute('data-part')}:${cell.getAttribute('data-type')}`,
      ),
    ).toEqual([
      'lineNumber:empty',
      'sign:empty',
      'code:empty',
      'lineNumber:add',
      'sign:add',
      'code:add',
    ]);
  });

  it('wordLevel, context, the empty label and actions', () => {
    expect(
      render(
        <Diff oldContent={OLD} newContent={NEW} wordLevel={false} />,
      ).container.querySelectorAll('ins, del'),
    ).toHaveLength(0);
    expect(
      render(<Diff oldContent={OLD} newContent={NEW} context={0} />).container.querySelectorAll(
        'tr[data-part="hunk"]',
      ),
    ).toHaveLength(2);
    const same = render(<Diff oldContent="a" newContent="a" emptyLabel="Sin cambios" />).container;
    expect(same.querySelector('tr[data-part="hunk"]')).toHaveTextContent('Sin cambios');
    const withActions = render(
      <Diff oldContent="a" newContent="b" actions={<button type="button">Copy</button>} />,
    ).container;
    expect(
      withActions.querySelector('[data-part="header"] > [data-part="actions"] > button'),
    ).not.toBeNull();
  });
});
