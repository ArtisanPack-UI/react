export type DaisyColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface GlassProps {
  glass?: boolean;
  glassPreset?: string;
}

export interface ColorProps {
  color?: DaisyColor;
}
