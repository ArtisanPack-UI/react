/**
 * The React fixture host for the design-system quality gates (`apui-gates`).
 * The gate runner bundles this entry into the fixture page; it registers the
 * components by their manifest name.
 */
import { registerReactHost } from '@artisanpack-ui/testing/react-host';
import { ImageGallery } from '../src/components/data/ImageGallery/ImageGallery';
import { ImageSlider } from '../src/components/data/ImageSlider/ImageSlider';

import { Table } from '../src/components/data/Table/Table';
import { Button } from '../src/components/form/Button/Button';
import { Checkbox } from '../src/components/form/Checkbox/Checkbox';
import { Input } from '../src/components/form/Input/Input';
import { Select } from '../src/components/form/Select/Select';
import { Combobox } from '../src/components/form/Combobox/Combobox';
import { DatePicker } from '../src/components/form/DatePicker/DatePicker';
import { Textarea } from '../src/components/form/Textarea/Textarea';
import { Password } from '../src/components/form/Password/Password';
import { Pin } from '../src/components/form/Pin/Pin';
import { Range } from '../src/components/form/Range/Range';
import { Toggle } from '../src/components/form/Toggle/Toggle';
import { Fieldset } from '../src/components/form/Fieldset/Fieldset';
import { Form } from '../src/components/form/Form/Form';
import { ValidationSummary } from '../src/components/form/ValidationSummary/ValidationSummary';
import { RadioGroup } from '../src/components/form/RadioGroup/RadioGroup';
import { CheckboxGroup } from '../src/components/form/CheckboxGroup/CheckboxGroup';
import { Rating } from '../src/components/form/Rating/Rating';
import { ColorPicker } from '../src/components/form/ColorPicker/ColorPicker';
import { File } from '../src/components/form/File/File';
import { Signature } from '../src/components/form/Signature/Signature';
import { RichTextEditor } from '../src/components/form/RichTextEditor/RichTextEditor';
import { CodeEditor } from '../src/components/form/CodeEditor/CodeEditor';
import { Toast } from '../src/components/feedback/Toast/Toast';
import { Alert } from '../src/components/feedback/Alert/Alert';
import { Loading } from '../src/components/feedback/Loading/Loading';
import { Skeleton } from '../src/components/feedback/Skeleton/Skeleton';
import { EmptyState } from '../src/components/feedback/EmptyState/EmptyState';
import { ErrorState } from '../src/components/feedback/ErrorState/ErrorState';
import { Progress } from '../src/components/data/Progress/Progress';
import { ProgressRadial } from '../src/components/data/ProgressRadial/ProgressRadial';
import { Card } from '../src/components/layout/Card/Card';
import { Dialog } from '../src/components/layout/Dialog/Dialog';
import { DropdownMenu } from '../src/components/layout/DropdownMenu/DropdownMenu';
import { Drawer } from '../src/components/layout/Drawer/Drawer';
import { Popover } from '../src/components/layout/Popover/Popover';
import { Tooltip } from '../src/components/utility/Tooltip/Tooltip';
import { Tabs } from '../src/components/layout/Tabs/Tabs';
import { Menu } from '../src/components/navigation/Menu/Menu';
import { Navbar } from '../src/components/navigation/Navbar/Navbar';
import { Breadcrumbs } from '../src/components/navigation/Breadcrumbs/Breadcrumbs';
import { Link } from '../src/components/navigation/Link/Link';
import { Pagination } from '../src/components/navigation/Pagination/Pagination';
import { Steps } from '../src/components/navigation/Steps/Steps';
import { Spotlight } from '../src/components/navigation/Spotlight/Spotlight';
import { Accordion } from '../src/components/layout/Accordion/Accordion';
import { AppShell } from '../src/components/layout/AppShell/AppShell';
import { Collapse } from '../src/components/layout/Collapse/Collapse';
import { Divider } from '../src/components/layout/Divider/Divider';
import { Grid } from '../src/components/layout/Grid/Grid';
import { PageHeader } from '../src/components/layout/PageHeader/PageHeader';
import { Stack } from '../src/components/layout/Stack/Stack';

import { Avatar } from '../src/components/data/Avatar/Avatar';
import { Badge } from '../src/components/data/Badge/Badge';
import { Heading } from '../src/components/layout/Heading/Heading';
import { ListItem } from '../src/components/layout/ListItem/ListItem';
import { Text } from '../src/components/layout/Text/Text';
import { UserMenu } from '../src/components/layout/UserMenu/UserMenu';
import { Stat } from '../src/components/data/Stat/Stat';
import { KpiCard } from '../src/components/data/KpiCard/KpiCard';
import { Sparkline } from '../src/components/data/Sparkline/Sparkline';
import { Timeline } from '../src/components/data/Timeline/Timeline';
import { Diff } from '../src/components/data/Diff/Diff';
import { Chart } from '../src/components/data/Chart/Chart';
import { Calendar } from '../src/components/data/Calendar/Calendar';
import { Carousel } from '../src/components/data/Carousel/Carousel';
import { Code } from '../src/components/data/Code/Code';
import { Icon } from '../src/components/utility/Icon/Icon';
import { ThemeToggle } from '../src/components/utility/ThemeToggle/ThemeToggle';
import { Markdown } from '../src/components/utility/Markdown/Markdown';
import { Kbd } from '../src/components/utility/Kbd/Kbd';
import { Swap } from '../src/components/utility/Swap/Swap';
import { Clipboard } from '../src/components/utility/Clipboard/Clipboard';
registerReactHost({
  Avatar,
  Badge,
  Heading,
  ListItem,
  Text,
  UserMenu,
  ImageGallery,
  ImageSlider,
  Table,
  Button,
  Card,
  Checkbox,
  Dialog,
  DropdownMenu,
  Drawer,
  Popover,
  Tooltip,
  Tabs,
  Menu,
  Navbar,
  Breadcrumbs,
  Link,
  Pagination,
  Steps,
  Input,
  Select,
  Combobox,
  DatePicker,
  Toast,
  Alert,
  Loading,
  Progress,
  ProgressRadial,
  Skeleton,
  EmptyState,
  ErrorState,
  Textarea,
  Password,
  Pin,
  Range,
  Toggle,
  Fieldset,
  Form,
  ValidationSummary,
  RadioGroup,
  CheckboxGroup,
  Rating,
  ColorPicker,
  File,
  Spotlight,
  Signature,
  RichTextEditor,
  CodeEditor,
  Accordion,
  AppShell,
  Collapse,
  Divider,
  Grid,
  PageHeader,
  Stack,
  Stat,
  KpiCard,
  Sparkline,
  Timeline,
  Diff,
  Chart,
  Calendar,
  Carousel,
  Code,
  Icon,
  ThemeToggle,
  Markdown,
  Kbd,
  Swap,
  Clipboard,
});
