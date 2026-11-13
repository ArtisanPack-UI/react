import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  File as FileUpload,
  formatFileSize,
  type FileProps,
} from '../../components/form/File/File';

const declaredProps: (keyof FileProps)[] = [
  'label',
  'title',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'accept',
  'multiple',
  'maxSize',
  'variant',
  'value',
  'removeLabel',
  'classes',
];
const declaredEvents: (keyof FileProps)[] = ['onValueChange', 'onRemove'];

describe('File', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(FileUpload, 'File', {
      declared: { props: declaredProps, events: declaredEvents },
    });
  });

  it('puts the native input over the drop zone', () => {
    const { container } = render(
      <FileUpload id="f" label="Photos" hint="JPG only" multiple accept="image/*" maxSize={1000} />,
    );
    const input = screen.getByLabelText('Photos') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.parentElement).toHaveAttribute('data-part', 'dropzone');
    expect(input).toHaveAttribute('multiple');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('aria-describedby', 'f-hint');
    expect(container.firstElementChild).toHaveAttribute('data-max-size', '1000');
    expect(container.querySelector('[data-part="title"]')).toHaveTextContent(
      'Drop files here or browse',
    );
  });

  it('names the input by the title without a label', () => {
    render(<FileUpload title="Upload a contract" />);
    expect(screen.getByLabelText('Upload a contract')).toHaveAttribute('type', 'file');
  });

  it('lists chosen files and removes one', () => {
    const onValueChange = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <FileUpload label="Docs" multiple onValueChange={onValueChange} onRemove={onRemove} />,
    );
    const a = new globalThis.File(['x'.repeat(2400)], 'a.pdf', { type: 'application/pdf' });
    const b = new globalThis.File(['y'], 'b.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Docs'), { target: { files: [a, b] } });
    expect(onValueChange).toHaveBeenLastCalledWith([a, b]);
    expect(container.querySelectorAll('[data-part="item"]')).toHaveLength(2);
    expect(container.querySelector('[data-part="meta"]')).toHaveTextContent('2.4 KB');
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(onRemove).toHaveBeenCalledWith(a, 0);
    expect(onValueChange).toHaveBeenLastCalledWith([b]);
    expect(container.querySelectorAll('[data-part="item"]')).toHaveLength(1);
  });

  it('shows progress and errors from value entries', () => {
    const { container } = render(
      <FileUpload
        value={[
          { name: 'up.jpg', size: 1000, progress: 64 },
          { name: 'bad.heic', error: 'Not supported.' },
        ]}
        removeLabel="Quitar :name"
      />,
    );
    const items = container.querySelectorAll('[data-part="item"]');
    expect(items[0]!.querySelector('progress')).toHaveAttribute('value', '64');
    expect(items[1]).toHaveAttribute('data-state', 'error');
    expect(items[1]!.querySelector('[data-part="meta"]')).toHaveTextContent('Not supported.');
    expect(screen.getByRole('button', { name: 'Quitar up.jpg' })).toBeInTheDocument();
  });

  it('sets the drag state while files are over the zone', () => {
    const { container } = render(<FileUpload label="Docs" />);
    const zone = container.querySelector('[data-part="dropzone"]')!;
    fireEvent.dragEnter(zone);
    expect(zone).toHaveAttribute('data-state', 'drag');
    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveAttribute('data-state');
  });

  it('formats sizes in decimal units', () => {
    expect(formatFileSize(999)).toBe('999 B');
    expect(formatFileSize(2400000)).toBe('2.4 MB');
  });
});
