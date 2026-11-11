/**
 * The React fixture host for the design-system quality gates (`apui-gates`).
 * The gate runner bundles this entry into the fixture page; it registers the
 * components by their manifest name.
 */
import { registerReactHost } from '@artisanpack-ui/testing/react-host';

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
import { Card } from '../src/components/layout/Card/Card';
import { Dialog } from '../src/components/layout/Dialog/Dialog';
import { DropdownMenu } from '../src/components/layout/DropdownMenu/DropdownMenu';
import { Tabs } from '../src/components/layout/Tabs/Tabs';
import { Menu } from '../src/components/navigation/Menu/Menu';
import { Navbar } from '../src/components/navigation/Navbar/Navbar';
import { Breadcrumbs } from '../src/components/navigation/Breadcrumbs/Breadcrumbs';
import { Link } from '../src/components/navigation/Link/Link';
import { Pagination } from '../src/components/navigation/Pagination/Pagination';
import { Steps } from '../src/components/navigation/Steps/Steps';
import { Spotlight } from '../src/components/navigation/Spotlight/Spotlight';

registerReactHost({
  Button,
  Card,
  Checkbox,
  Dialog,
  DropdownMenu,
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
});
