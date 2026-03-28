import { describe, it, expect } from 'vitest';
import {
  durations,
  easings,
  expressiveEasings,
  daisyAnimation,
  transitionProperties,
} from '../animation';

describe('durations', () => {
  it('defines a range from 0 to 1000ms', () => {
    expect(durations[0]).toBe('0ms');
    expect(durations[200]).toBe('200ms');
    expect(durations[1000]).toBe('1000ms');
  });
});

describe('easings', () => {
  it('defines standard easing functions', () => {
    expect(easings.linear).toBe('linear');
    expect(easings.in).toContain('cubic-bezier');
    expect(easings.out).toContain('cubic-bezier');
    expect(easings.inOut).toContain('cubic-bezier');
  });
});

describe('expressiveEasings', () => {
  it('defines spring, bounce, and elastic curves', () => {
    expect(expressiveEasings.spring).toContain('cubic-bezier');
    expect(expressiveEasings.bounce).toContain('cubic-bezier');
    expect(expressiveEasings.elastic).toContain('cubic-bezier');
  });
});

describe('daisyAnimation', () => {
  it('defines DaisyUI animation values', () => {
    expect(daisyAnimation.btn).toBe('0.25s');
    expect(daisyAnimation.input).toBe('0.2s');
    expect(daisyAnimation.btnFocusScale).toBe(0.95);
  });
});

describe('transitionProperties', () => {
  it('defines common transition property lists', () => {
    expect(transitionProperties.all).toBe('all');
    expect(transitionProperties.colors).toContain('color');
    expect(transitionProperties.opacity).toBe('opacity');
    expect(transitionProperties.transform).toBe('transform');
  });
});
