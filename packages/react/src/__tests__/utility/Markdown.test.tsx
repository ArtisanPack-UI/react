import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Markdown } from '../../components/utility/Markdown/Markdown';

describe('Markdown', () => {
  it('renders a heading', () => {
    render(<Markdown source="# Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hello').tagName).toBe('H1');
  });

  it('renders multiple heading levels', () => {
    render(<Markdown source={'# H1\n## H2\n### H3'} />);
    expect(screen.getByText('H1').tagName).toBe('H1');
    expect(screen.getByText('H2').tagName).toBe('H2');
    expect(screen.getByText('H3').tagName).toBe('H3');
  });

  it('renders bold text', () => {
    render(<Markdown source="This is **bold** text" />);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });

  it('renders italic text', () => {
    render(<Markdown source="This is *italic* text" />);
    expect(screen.getByText('italic').tagName).toBe('EM');
  });

  it('renders inline code', () => {
    render(<Markdown source="Use `code` here" />);
    expect(screen.getByText('code').tagName).toBe('CODE');
  });

  it('renders links', () => {
    render(<Markdown source="Visit [Example](https://example.com)" />);
    const link = screen.getByText('Example');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders unordered lists', () => {
    const { container } = render(<Markdown source={'- Item 1\n- Item 2\n- Item 3'} />);
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toBe('Item 1');
  });

  it('renders ordered lists', () => {
    const { container } = render(<Markdown source={'1. First\n2. Second'} />);
    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders blockquotes', () => {
    const { container } = render(<Markdown source="> Important note" />);
    expect(container.querySelector('blockquote')).toBeInTheDocument();
  });

  it('renders horizontal rules', () => {
    const { container } = render(<Markdown source={'Above\n\n---\n\nBelow'} />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders paragraphs for plain text', () => {
    const { container } = render(<Markdown source="Just a paragraph" />);
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('p')!.textContent).toBe('Just a paragraph');
  });

  it('uses custom renderMarkdown function', () => {
    const custom = vi.fn().mockReturnValue('<p>Custom output</p>');
    render(<Markdown source="input" renderMarkdown={custom} />);
    expect(custom).toHaveBeenCalledWith('input');
    expect(screen.getByText('Custom output')).toBeInTheDocument();
  });

  it('applies prose class', () => {
    const { container } = render(<Markdown source="text" />);
    expect(container.firstChild).toHaveClass('prose');
  });

  it('applies custom className', () => {
    const { container } = render(<Markdown source="text" className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Markdown ref={ref} source="text" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('escapes HTML in source', () => {
    const { container } = render(<Markdown source='<script>alert("xss")</script>' />);
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });

  it('rejects javascript: URLs in links', () => {
    const { container } = render(<Markdown source="[click](javascript:alert)" />);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(screen.getByText('click')).toBeInTheDocument();
  });

  it('rejects javascript: URLs with HTML entities', () => {
    const { container } = render(<Markdown source="[click](java&#115;cript:alert)" />);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(screen.getByText('click')).toBeInTheDocument();
  });

  it('allows relative URLs in links', () => {
    const { container } = render(<Markdown source="[page](/about)" />);
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });
});
