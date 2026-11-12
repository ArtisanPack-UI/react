import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Timeline,
  TimelineItem,
  type TimelineProps,
} from '../../components/data/Timeline/Timeline';

const declaredProps: (keyof TimelineProps)[] = ['items', 'variant', 'label', 'classes'];

describe('Timeline', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Timeline, 'Timeline', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('composes an ordered list from TimelineItem children', () => {
    const { container } = render(
      <Timeline label="Activity">
        <TimelineItem
          icon="circle-check"
          color="success"
          time="2h ago"
          datetime="2026-11-12T08:00"
          description="Phoenix Baker accepted $248,000."
        >
          <strong>Offer accepted</strong> on Lakeview Lofts
        </TimelineItem>
        <TimelineItem title="Listing published" time="Dec 13" />
      </Timeline>,
    );
    const list = screen.getByRole('list', { name: 'Activity' });
    expect(list.className).toBe('apui-timeline');
    expect(list.getAttribute('data-variant')).toBe('icon');
    const items = container.querySelectorAll('li[data-scope="timeline"][data-part="item"]');
    expect(items).toHaveLength(2);
    expect([...items[0]!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'marker',
      'head',
      'body',
    ]);
    const marker = items[0]!.querySelector('[data-part="marker"]')!;
    expect(marker.getAttribute('data-color')).toBe('success');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
    expect(marker.querySelector('svg')).not.toBeNull();
    expect(items[0]!.querySelector('[data-part="head"] > strong')).toHaveTextContent(
      'Offer accepted',
    );
    expect(items[0]!.querySelector('time[data-part="time"]')!.getAttribute('datetime')).toBe(
      '2026-11-12T08:00',
    );
    const plain = items[1]!.querySelector('[data-part="marker"]')!;
    expect(plain.hasAttribute('data-color')).toBe(false);
    expect(plain.childNodes).toHaveLength(0);
  });

  it('renders items before composed children, with dots and cards', () => {
    const { container } = render(
      <Timeline
        variant="dot"
        items={[
          { title: 'Delivered', time: 'Nov 7', color: 'success' },
          { title: 'Olivia commented', card: 'Thursday at 11?', icon: 'message-square' },
        ]}
      >
        <TimelineItem title="Shipped" />
      </Timeline>,
    );
    expect(container.querySelector('ol')!.getAttribute('data-variant')).toBe('dot');
    expect(
      [...container.querySelectorAll('[data-part="head"]')].map(
        (head) => head.firstChild!.textContent,
      ),
    ).toEqual(['Delivered', 'Olivia commented', 'Shipped']);
    expect(container.querySelector('[data-part="card"]')).toHaveTextContent('Thursday at 11?');
    expect(container.querySelector('time')!.hasAttribute('datetime')).toBe(false);
  });

  it('passes classes to every item, and forwards refs', () => {
    const ref = createRef<HTMLOListElement>();
    const itemRef = createRef<HTMLLIElement>();
    const { container } = render(
      <Timeline ref={ref} classes={{ root: 'r', item: 'i', time: 't' }}>
        <TimelineItem ref={itemRef} title="A" time="now" />
      </Timeline>,
    );
    expect(ref.current!.className).toBe('apui-timeline r');
    expect(itemRef.current!.className).toBe('i');
    expect(container.querySelector('time')!.className).toBe('t');
  });
});
