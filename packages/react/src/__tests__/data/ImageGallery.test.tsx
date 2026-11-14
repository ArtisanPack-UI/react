import { createRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  ImageGallery,
  type ImageGalleryImage,
  type ImageGalleryProps,
} from '../../components/data/ImageGallery/ImageGallery';

const declaredProps: (keyof ImageGalleryProps)[] = [
  'images',
  'columns',
  'featured',
  'lightbox',
  'open',
  'defaultOpen',
  'index',
  'defaultIndex',
  'downloadable',
  'modal',
  'portal',
  'closeLabel',
  'previousLabel',
  'nextLabel',
  'downloadLabel',
  'counterLabel',
  'thumbsLabel',
  'classes',
];

const IMAGES: ImageGalleryImage[] = [
  { src: '/a.jpg', alt: 'Lobby', caption: 'The lobby' },
  { src: '/b.jpg', alt: 'Roof', caption: 'The roof terrace' },
  { src: '/c.jpg', alt: 'Street' },
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="image-gallery"][data-part="${name}"]`) as HTMLElement | null;
const parts = (root: ParentNode, name: string) => [
  ...root.querySelectorAll(`[data-scope="image-gallery"][data-part="${name}"]`),
];
const content = () => document.querySelector('.apui-lightbox') as HTMLElement;
const stageImage = () => part(part(document, 'stage')!, 'image') as HTMLImageElement;
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('ImageGallery', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ImageGallery, 'ImageGallery', {
      declared: { props: declaredProps, events: ['onOpenChange', 'onIndexChange'] },
      // downloadLabel only renders with downloadable, which the parity render leaves off.
      ignoreEffects: ['defaultOpen', 'defaultIndex', 'modal', 'portal', 'downloadLabel'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(
      <ImageGallery images={IMAGES} open portal={false} modal={false} downloadable />,
    );
    for (const name of [
      'root',
      'grid',
      'item',
      'trigger',
      'image',
      'caption',
      'backdrop',
      'positioner',
      'content',
      'bar',
      'title',
      'download',
      'close-trigger',
      'stage',
      'prev-trigger',
      'next-trigger',
      'thumbs',
      'thumb',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the grid with alt text, captions, columns and featured', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ImageGallery ref={ref} images={IMAGES} columns={3} featured portal={false} />,
    );
    const root = container.querySelector('.apui-image-gallery') as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-featured', '');
    expect(root.style.getPropertyValue('--apui-_image-gallery-columns')).toBe('3');
    const items = parts(part(root, 'grid')!, 'item');
    expect(items).toHaveLength(3);
    expect(items[0]!.tagName).toBe('FIGURE');
    expect(screen.getByRole('button', { name: 'Roof' })).toHaveAttribute('aria-haspopup', 'dialog');
    const img = part(items[0]!, 'image') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', 'Lobby');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(part(items[0]!, 'caption')).toHaveTextContent('The lobby');
    expect(part(items[2]!, 'caption')).toBeNull();
  });

  it('renders a plain grid without lightbox', () => {
    const { container } = render(<ImageGallery images={IMAGES} lightbox={false} />);
    expect(part(container, 'trigger')).toBeNull();
    expect(part(container, 'content')).toBeNull();
    expect(container.querySelector('.apui-image-gallery')).not.toHaveAttribute('data-featured');
    expect(parts(container, 'image')).toHaveLength(3);
  });

  it('opens on the clicked image, steps with arrow keys, and closes on Escape', async () => {
    const onOpenChange = vi.fn();
    const onIndexChange = vi.fn();
    render(
      <ImageGallery
        images={IMAGES}
        portal={false}
        onOpenChange={onOpenChange}
        onIndexChange={onIndexChange}
      />,
    );
    expect(content()).toHaveAttribute('hidden');
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Roof' })));
    expect(content()).not.toHaveAttribute('hidden');
    expect(screen.getByRole('dialog')).toHaveAccessibleName('2 / 3 · The roof terrace');
    expect(stageImage()).toHaveAttribute('alt', 'Roof');
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onIndexChange).toHaveBeenCalledWith(1);
    await interact(() => fireEvent.keyDown(content(), { key: 'ArrowRight' }));
    expect(stageImage()).toHaveAttribute('alt', 'Street');
    expect(part(content(), 'title')).toHaveTextContent('3 / 3');
    await interact(() => fireEvent.keyDown(content(), { key: 'ArrowRight' }));
    expect(stageImage()).toHaveAttribute('alt', 'Lobby');
    await interact(() => fireEvent.keyDown(content(), { key: 'End' }));
    expect(stageImage()).toHaveAttribute('alt', 'Street');
    await interact(() => fireEvent.keyDown(content(), { key: 'Home' }));
    expect(stageImage()).toHaveAttribute('alt', 'Lobby');
    expect(parts(content(), 'thumb').map((el) => el.getAttribute('aria-current'))).toEqual([
      'true',
      null,
      null,
    ]);
    await interact(() => fireEvent.keyDown(document.activeElement ?? content(), { key: 'Escape' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('follows the text direction: ArrowLeft shows the next image in RTL', async () => {
    // jsdom doesn't inherit `direction`: read it from the nearest dir attribute.
    const original = window.getComputedStyle;
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
      const style = original(el, pseudo);
      return el.closest('[dir="rtl"]')
        ? (new Proxy(style, {
            get: (target, key) => (key === 'direction' ? 'rtl' : Reflect.get(target, key, target)),
          }) as CSSStyleDeclaration)
        : style;
    });
    render(
      <div dir="rtl" style={{ direction: 'rtl' }}>
        <ImageGallery images={IMAGES} portal={false} defaultOpen />
      </div>,
    );
    await interact(() => fireEvent.keyDown(content(), { key: 'ArrowLeft' }));
    expect(stageImage()).toHaveAttribute('alt', 'Roof');
    await interact(() => fireEvent.keyDown(content(), { key: 'ArrowRight' }));
    expect(stageImage()).toHaveAttribute('alt', 'Lobby');
    spy.mockRestore();
  });

  it('moves with the previous and next buttons and the thumbs', async () => {
    render(<ImageGallery images={IMAGES} portal={false} defaultOpen defaultIndex={1} />);
    expect(stageImage()).toHaveAttribute('alt', 'Roof');
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Next photo' })));
    expect(stageImage()).toHaveAttribute('alt', 'Street');
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Previous photo' })));
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Previous photo' })));
    expect(stageImage()).toHaveAttribute('alt', 'Lobby');
    await interact(() => fireEvent.click(parts(content(), 'thumb')[2]!));
    expect(stageImage()).toHaveAttribute('alt', 'Street');
  });

  it('follows a controlled index and open state', async () => {
    function Controlled() {
      const [index, setIndex] = useState(2);
      return (
        <>
          <button type="button" onClick={() => setIndex(0)}>
            first
          </button>
          <ImageGallery
            images={IMAGES}
            portal={false}
            open
            index={index}
            onIndexChange={setIndex}
          />
        </>
      );
    }
    render(<Controlled />);
    expect(stageImage()).toHaveAttribute('alt', 'Street');
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'first' })));
    expect(stageImage()).toHaveAttribute('alt', 'Lobby');
    await interact(() => fireEvent.keyDown(content(), { key: 'ArrowLeft' }));
    expect(stageImage()).toHaveAttribute('alt', 'Street');
  });

  it('takes its built-in labels as props', () => {
    render(
      <ImageGallery
        images={IMAGES}
        portal={false}
        open
        downloadable
        closeLabel="Cerrar"
        previousLabel="Anterior"
        nextLabel="Siguiente"
        downloadLabel="Descargar"
        counterLabel="Foto {index} de {count}"
        thumbsLabel="Fotos"
      />,
    );
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveAttribute(
      'data-part',
      'close-trigger',
    );
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Descargar' })).toHaveAttribute('href', '/a.jpg');
    expect(screen.getByRole('group', { name: 'Fotos' })).toBeInTheDocument();
    expect(part(content(), 'title')).toHaveTextContent('Foto 1 de 3 · The lobby');
  });
});
