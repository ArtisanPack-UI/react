import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Drawer } from '../../components/layout/Drawer/Drawer';

describe('Drawer', () => {
  it('renders main content', () => {
    render(
      <Drawer open={false} onClose={vi.fn()} side={<div>Side</div>}>
        Main content
      </Drawer>,
    );
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('renders side content', () => {
    render(
      <Drawer open={true} onClose={vi.fn()} side={<div>Side panel</div>}>
        Main
      </Drawer>,
    );
    expect(screen.getByText('Side panel')).toBeInTheDocument();
  });

  it('applies drawer-end for right side', () => {
    const { container } = render(
      <Drawer open={false} onClose={vi.fn()} side={<div>Side</div>} end>
        Main
      </Drawer>,
    );
    expect(container.firstChild).toHaveClass('drawer-end');
  });

  it('sets checked state on toggle input', () => {
    const { container } = render(
      <Drawer open={true} onClose={vi.fn()} side={<div>Side</div>}>
        Main
      </Drawer>,
    );
    const toggle = container.querySelector('.drawer-toggle') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} side={<div>Side</div>}>
        Main
      </Drawer>,
    );
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose on overlay click when persistent', () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} side={<div>Side</div>} persistent>
        Main
      </Drawer>,
    );
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has dialog role when open', () => {
    render(
      <Drawer open={true} onClose={vi.fn()} side={<div>Side</div>}>
        Main
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Drawer ref={ref} open={false} onClose={vi.fn()} side={<div>Side</div>}>
        Main
      </Drawer>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
