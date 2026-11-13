import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';
import { FeatureToggles } from '../../components/ai/FeatureToggles/FeatureToggles';
import { SettingsPage } from '../../components/ai/SettingsPage/SettingsPage';
import { UsageDashboard } from '../../components/ai/UsageDashboard/UsageDashboard';
import { createStorybookMockClient } from '../../components/ai/mockClient';

/** DaisyUI component classes the 1.x AI components used; none has styles in 2.0. */
const daisyClasses = [
  'alert',
  'btn',
  'form-control',
  'input',
  'input-bordered',
  'label-text',
  'loading',
  'select',
  'stat',
  'stats',
  'table',
  'textarea',
  'toggle',
];

const cases: [string, () => ReactElement, string, string[]][] = [
  [
    'FeatureToggles',
    () => <FeatureToggles client={createStorybookMockClient()} />,
    'ai-feature-toggles',
    ['apui-toggle', 'apui-card'],
  ],
  [
    'SettingsPage',
    () => <SettingsPage client={createStorybookMockClient()} />,
    'ai-settings-page',
    ['apui-form', 'apui-fieldset', 'apui-select', 'apui-input', 'apui-button'],
  ],
  [
    'UsageDashboard',
    () => <UsageDashboard client={createStorybookMockClient()} />,
    'ai-usage-dashboard',
    ['apui-stat', 'apui-table'],
  ],
];

describe('AI components on the design system', () => {
  it.each(cases)(
    '%s renders design-system components, not DaisyUI markup',
    async (_name, ui, testId, expected) => {
      const { container } = render(ui());
      await waitFor(
        () => {
          expect(container.querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
          for (const name of expected) {
            expect(container.querySelector(`.${name}`), name).not.toBeNull();
          }
        },
        { timeout: 2000 },
      );

      const used = new Set(
        Array.from(container.querySelectorAll('[class]')).flatMap((el) => Array.from(el.classList)),
      );

      expect(daisyClasses.filter((name) => used.has(name))).toEqual([]);
    },
  );
});
