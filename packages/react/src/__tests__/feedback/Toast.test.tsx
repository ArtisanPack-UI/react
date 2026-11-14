import { createRef, type ReactElement } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Button } from '../../components/form/Button/Button';
import { Toast, type ToastProps } from '../../components/feedback/Toast/Toast';
import { Toaster, createToaster, toast } from '../../components/feedback/Toast/Toaster';

const declaredProps: (keyof ToastProps)[] = [
  'title',
  'description',
  'color',
  'variant',
  'surface',
  'icon',
  'actions',
  'hideClose',
  'closeLabel',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="toast"][data-part="${name}"]`);

describe('Toast', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Toast, 'Toast', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Toast title="Listing saved" description="Cedarwood Estates is live now." actions="Undo" />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-toast');
    expect(root).toHaveAttribute('data-part', 'root');
    expect(root).toHaveAttribute('role', 'status');
    expect(root).toHaveAttribute('data-color', 'neutral');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveAttribute('data-surface', 'overlay');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'actions',
      'close-trigger',
    ]);
    expect(part(root, 'title')!.tagName).toBe('P');
    expect(screen.getByRole('status', { name: 'Listing saved' })).toHaveAccessibleDescription(
      'Cedarwood Estates is live now.',
    );
    const close = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(close).toHaveClass('apui-button');
    expect(close).toHaveAttribute('data-variant', 'ghost');
    expect(close).toHaveAttribute('data-size', 'sm');
  });

  it('makes an error toast an alert', () => {
    render(<Toast color="error" title="Upload failed" />);
    expect(screen.getByRole('alert', { name: 'Upload failed' })).toHaveAttribute(
      'data-color',
      'error',
    );
  });

  it("shows the color's status icon, a named icon, or a node", () => {
    const { container, rerender } = render(<Toast color="success" title="Saved" />);
    const svg = () => part(container, 'icon')!.querySelector('svg')!.innerHTML;
    const success = svg();
    rerender(<Toast color="info" title="Saved" />);
    expect(svg()).not.toBe(success);
    rerender(<Toast color="info" icon="trash" title="Saved" />);
    const trash = svg();
    rerender(<Toast color="info" title="Saved" />);
    expect(svg()).not.toBe(trash);
    rerender(<Toast title="Saved" icon={<i data-testid="custom" />} />);
    expect(part(container, 'icon')).toContainElement(screen.getByTestId('custom'));
  });

  it('names the close button with closeLabel', () => {
    render(<Toast title="Saved" closeLabel="Fermer" />);
    expect(screen.getByRole('button', { name: 'Fermer' })).toHaveAttribute(
      'data-part',
      'close-trigger',
    );
  });

  it('reports open-change false from the close button', () => {
    const onOpenChange = vi.fn();
    render(<Toast title="Saved" onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('hides the close button with hideClose, and omits empty parts', () => {
    const { container } = render(<Toast hideClose />);
    expect(
      [...container.firstElementChild!.children].map((el) => el.getAttribute('data-part')),
    ).toEqual(['icon']);
    expect(container.firstElementChild).not.toHaveAttribute('aria-labelledby');
  });

  it('emits variant and surface, and applies classes and native attributes', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Toast
        ref={ref}
        variant="inverse"
        surface="glass"
        title="Saved"
        className="extra"
        classes={{ root: 'r', title: 't', closeTrigger: 'c' }}
        data-testid="toast"
      />,
    );
    const root = screen.getByTestId('toast');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-variant', 'inverse');
    expect(root).toHaveAttribute('data-surface', 'glass');
    expect(root).toHaveClass('apui-toast', 'r', 'extra');
    expect(part(container, 'title')).toHaveClass('t');
    expect(part(container, 'close-trigger')).toHaveClass('apui-button', 'c');
  });

  it('renders action nodes in the actions part', () => {
    const { container } = render(
      <Toast
        title="Listing archived"
        actions={
          <Button size="sm" variant="outline" color="neutral">
            Undo
          </Button>
        }
      />,
    );
    expect(part(container, 'actions')).toContainElement(
      screen.getByRole('button', { name: 'Undo' }),
    );
  });
});

describe('Toaster', () => {
  afterEach(() => {
    toast.remove();
  });

  // Zag appends the placement and the hotkey to the label: "Notifications, bottom-end (alt+T)".
  const region = () => screen.getByRole('region', { name: /^Notifications/ });

  // Zag runs a toast's timers on requestAnimationFrame and syncs its height and
  // parts from a MutationObserver, so a toaster keeps scheduling work after each
  // update. An async act() would keep flushing that work (and can livelock under
  // load), so these tests leave the act environment and wait for the DOM instead.
  const actEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
  let previousActEnvironment: boolean | undefined;
  beforeAll(() => {
    previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });
  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  });

  const renderToaster = (ui: ReactElement) => render(ui);
  const durationOf = (title: string) =>
    toast.store.getVisibleToasts().find((entry) => entry.title === title)?.duration;
  const update = (fn: () => void) => fn();

  it('renders a labelled region at the end of the body', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} />);
    expect(region()).toHaveAttribute('data-scope', 'toast');
    expect(region()).toHaveAttribute('data-part', 'group');
    expect(region()).toHaveAttribute('aria-live', 'polite');
    expect(region().parentElement).toBe(document.body);
  });

  it('takes a label', async () => {
    renderToaster(<Toaster toaster={createToaster()} label="Alerts" />);
    expect(screen.getByRole('region', { name: /^Alerts/ })).toBeInTheDocument();
  });

  it('shows toasts created from data with the same markup as a standalone Toast', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} />);
    update(() => {
      toaster.create({ title: 'Listing saved', description: 'Live now.', color: 'success' });
    });
    const item = await within(region()).findByText('Listing saved');
    const root = item.closest('.apui-toast')!;
    expect(root).toHaveAttribute('data-part', 'root');
    expect(root).toHaveAttribute('data-color', 'success');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveAttribute('data-surface', 'overlay');
    expect(root).toHaveAttribute('role', 'status');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'close-trigger',
    ]);
    expect(part(root, 'icon')!.querySelector('svg')).not.toBeNull();
  });

  it('makes an error toast an alert', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} />);
    update(() => {
      toaster.create({ title: 'Upload failed', color: 'error' });
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('dismisses a toast from its close button', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} />);
    update(() => {
      toaster.create({ title: 'Listing saved' });
    });
    const close = await within(region()).findByRole('button', { name: 'Dismiss notification' });
    update(() => fireEvent.click(close));
    // Removal follows the exit (removeDelay, on animation frames), which is slow in jsdom under load.
    await waitFor(() => expect(within(region()).queryByText('Listing saved')).toBeNull(), {
      timeout: 5000,
    });
  });

  it('dismisses a toast by id', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} />);
    let id = '';
    update(() => {
      id = toaster.create({ title: 'Listing saved' });
    });
    await within(region()).findByText('Listing saved');
    update(() => toaster.dismiss(id));
    // Removal follows the exit (removeDelay, on animation frames), which is slow in jsdom under load.
    await waitFor(() => expect(within(region()).queryByText('Listing saved')).toBeNull(), {
      timeout: 5000,
    });
  });

  it('runs the action, then dismisses the toast', async () => {
    const toaster = createToaster({ duration: 0 });
    const onClick = vi.fn();
    renderToaster(<Toaster toaster={toaster} />);
    update(() => {
      toaster.create({ title: 'Listing archived', action: { label: 'Undo', onClick } });
    });
    const undo = await within(region()).findByRole('button', { name: 'Undo' });
    expect(undo).toHaveAttribute('data-part', 'action-trigger');
    expect(undo).toHaveClass('apui-button');
    expect(undo.parentElement).toHaveAttribute('data-part', 'actions');
    update(() => fireEvent.click(undo));
    expect(onClick).toHaveBeenCalledTimes(1);
    // Removal follows the exit (removeDelay, on animation frames), which is slow in jsdom under load.
    await waitFor(() => expect(within(region()).queryByText('Listing archived')).toBeNull(), {
      timeout: 5000,
    });
  });

  it('hides the close button with hideClose', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} />);
    update(() => {
      toaster.create({ title: 'Saving', hideClose: true });
    });
    await within(region()).findByText('Saving');
    expect(within(region()).queryByRole('button')).toBeNull();
  });

  it('times a toast out after its duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const toaster = createToaster({ duration: 1000 });
      renderToaster(<Toaster toaster={toaster} />);
      update(() => {
        toaster.create({ title: 'Listing saved' });
      });
      expect(await within(region()).findByText('Listing saved')).toBeInTheDocument();
      await vi.advanceTimersByTimeAsync(3000);
      // Removal follows the exit (removeDelay, on animation frames), which is slow in jsdom under load.
      await waitFor(() => expect(within(region()).queryByText('Listing saved')).toBeNull(), {
        timeout: 5000,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders the default toast toaster', async () => {
    renderToaster(<Toaster duration={0} />);
    update(() => {
      toast.create({ title: 'From the default toaster' });
    });
    expect(await within(region()).findByText('From the default toaster')).toBeInTheDocument();
  });

  it('names each close button with closeLabel', async () => {
    const toaster = createToaster({ duration: 0 });
    renderToaster(<Toaster toaster={toaster} closeLabel="Fermer" />);
    update(() => {
      toaster.create({ title: 'Listing saved' });
    });
    expect(await within(region()).findByRole('button', { name: 'Fermer' })).toHaveAttribute(
      'data-part',
      'close-trigger',
    );
  });

  it("auto-dismisses the default toaster's toasts after the Toaster's duration", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      renderToaster(<Toaster duration={1000} />);
      update(() => {
        toast.create({ title: 'Timed' });
      });
      expect(await within(region()).findByText('Timed')).toBeInTheDocument();
      expect(toast.store.getVisibleToasts()[0]?.duration).toBe(1000);
      await vi.advanceTimersByTimeAsync(3000);
      await waitFor(() => expect(within(region()).queryByText('Timed')).toBeNull(), {
        timeout: 5000,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders a store in one region only, so two Toasters show each toast once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { unmount } = render(
      <>
        <Toaster duration={0} />
        <Toaster />
      </>,
    );
    update(() => {
      toast.create({ title: 'Once' });
    });
    expect(await screen.findAllByText('Once')).toHaveLength(1);
    expect(screen.getAllByRole('region', { name: /^Notifications/ })).toHaveLength(1);
    unmount();
    warn.mockRestore();
  });

  it('hands the store to the next Toaster when the first unmounts', async () => {
    const toaster = createToaster({ duration: 0 });
    const first = render(<Toaster toaster={toaster} label="First" />);
    renderToaster(<Toaster toaster={toaster} label="Second" />);
    expect(screen.getByRole('region', { name: /^First/ })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /^Second/ })).toBeNull();
    first.unmount();
    expect(await screen.findByRole('region', { name: /^Second/ })).toBeInTheDocument();
  });

  it("keeps another Toaster's duration when it has none, and restores settings on unmount", async () => {
    const view = render(<Toaster duration={1234} placement="top-start" gap={12} />);
    expect(toast.store.attrs).toMatchObject({ placement: 'top-start', gap: 12 });
    update(() => {
      toast.create({ title: 'First' });
    });
    expect(durationOf('First')).toBe(1234);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const other = render(<Toaster />);
    update(() => {
      toast.create({ title: 'Still' });
    });
    expect(durationOf('Still')).toBe(1234);
    other.unmount();
    warn.mockRestore();
    view.unmount();
    expect(toast.store.attrs).toMatchObject({ placement: 'bottom-end', gap: 8 });
    toast.remove();

    const second = render(<Toaster />);
    update(() => {
      toast.create({ title: 'Second' });
    });
    expect(durationOf('Second')).toBe(5000);
    second.unmount();
  });

  it('patches a toast with update(), keeping its duration and other fields', async () => {
    renderToaster(<Toaster duration={1234} />);
    let id = '';
    update(() => {
      id = toast.create({ title: 'Uploading', description: 'photo.jpg' });
    });
    await within(region()).findByText('Uploading');
    update(() => {
      toast.update(id, { title: 'Uploaded' });
    });
    expect(await within(region()).findByText('Uploaded')).toBeInTheDocument();
    expect(within(region()).getByText('photo.jpg')).toBeInTheDocument();
    expect(durationOf('Uploaded')).toBe(1234);
  });

  it('applies placement and gap to the store', async () => {
    const toaster = createToaster();
    renderToaster(
      <Toaster toaster={toaster} placement="top-start" gap={12} max={2} offsets="24px" />,
    );
    expect(toaster.store.attrs).toMatchObject({
      placement: 'top-start',
      gap: 12,
      max: 2,
      offsets: '24px',
    });
  });
});
