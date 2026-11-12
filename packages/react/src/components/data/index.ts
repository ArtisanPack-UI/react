/**
 * @module data
 *
 * Data display component exports for the ArtisanPack UI React library.
 * Includes avatars, badges, calendars, carousels, charts, code blocks,
 * diffs, progress bars, sparklines, stats, tables, and timelines.
 */

export { Avatar, AvatarGroup, avatarColor, avatarInitials } from './Avatar/Avatar';
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarGroupItem,
  AvatarColor,
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  AvatarPart,
} from './Avatar/Avatar';

export { Badge } from './Badge/Badge';
export type { BadgeProps, BadgeVariant, BadgeColor, BadgeSize, BadgePart } from './Badge/Badge';

export { Progress } from './Progress/Progress';
export type { ProgressProps, ProgressSize, ProgressColor, ProgressPart } from './Progress/Progress';

export { ProgressRadial } from './ProgressRadial/ProgressRadial';
export type { ProgressRadialProps, ProgressRadialPart } from './ProgressRadial/ProgressRadial';

export { Stat } from './Stat/Stat';
export type { StatProps, StatColor, StatPart, StatSize, StatTrend } from './Stat/Stat';

export { KpiCard } from './KpiCard/KpiCard';
export type { KpiCardProps, KpiCardPart, KpiCardStat, KpiCardTarget } from './KpiCard/KpiCard';

export { Timeline, TimelineItem } from './Timeline/Timeline';
export type {
  TimelineProps,
  TimelineItemProps,
  TimelineItemData,
  TimelineColor,
  TimelinePart,
  TimelineVariant,
} from './Timeline/Timeline';

export { Code } from './Code/Code';
export type { CodeProps } from './Code/Code';

export { Diff } from './Diff/Diff';
export type { DiffProps, DiffPart, DiffView } from './Diff/Diff';

export { Carousel } from './Carousel/Carousel';
export type { CarouselProps, CarouselSlide } from './Carousel/Carousel';

export { Table, tableValue } from './Table/Table';
export type {
  TableProps,
  TableColumn,
  TableHeader,
  TableKey,
  TablePart,
  TableSort,
  TableSortConfig,
} from './Table/Table';

export { Calendar } from './Calendar/Calendar';
export type { CalendarProps, CalendarEvent } from './Calendar/Calendar';

export { Sparkline } from './Sparkline/Sparkline';
export type { SparklineProps, SparklinePart, SparklineVariant } from './Sparkline/Sparkline';

export { Chart } from './Chart/Chart';
export type { ChartProps, ChartSeries, ChartDataPoint, ChartType } from './Chart/Chart';

export { ImageGallery } from './ImageGallery/ImageGallery';
export type {
  ImageGalleryProps,
  ImageGalleryImage,
  ImageGalleryPart,
} from './ImageGallery/ImageGallery';

export { ImageSlider } from './ImageSlider/ImageSlider';
export type {
  ImageSliderProps,
  ImageSliderImage,
  ImageSliderPart,
} from './ImageSlider/ImageSlider';
