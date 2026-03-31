import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from '../../components/layout/Modal/Modal';

describe('Modal', () => {
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      Object.defineProperty(this, 'open', { value: true, writable: true, configurable: true });
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      Object.defineProperty(this, 'open', { value: false, writable: true, configurable: true });
    });
  });

  afterEach(() => {
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
  });

  it('renders children when open', () => {
    render(
      <Modal open onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <Modal open onClose={vi.fn()} title="My Modal">
        Content
      </Modal>,
    );
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <Modal open onClose={vi.fn()} title="Title" subtitle="Subtitle">
        Content
      </Modal>,
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <Modal open onClose={vi.fn()} actions={<button>Save</button>}>
        Content
      </Modal>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(
      <Modal open onClose={vi.fn()}>
        Content
      </Modal>,
    );
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('hides close button when persistent', () => {
    render(
      <Modal open onClose={vi.fn()} persistent>
        Content
      </Modal>,
    );
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Content
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls showModal when open becomes true', () => {
    render(
      <Modal open onClose={vi.fn()}>
        Content
      </Modal>,
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('calls close when open becomes false', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal open onClose={onClose}>
        Content
      </Modal>,
    );
    rerender(
      <Modal open={false} onClose={onClose}>
        Content
      </Modal>,
    );
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('applies glass effect', () => {
    render(
      <Modal open onClose={vi.fn()} glass>
        Content
      </Modal>,
    );
    expect(document.querySelector('.modal-box')).toHaveClass('glass');
  });

  it('applies bottom positioning', () => {
    render(
      <Modal open onClose={vi.fn()} bottom>
        Content
      </Modal>,
    );
    expect(document.querySelector('.modal')).toHaveClass('modal-bottom');
  });

  it('has aria-modal attribute', () => {
    render(
      <Modal open onClose={vi.fn()}>
        Content
      </Modal>,
    );
    expect(document.querySelector('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Modal ref={ref} open onClose={vi.fn()}>
        Content
      </Modal>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
