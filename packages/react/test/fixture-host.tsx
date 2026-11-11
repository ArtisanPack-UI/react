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
import { Toast } from '../src/components/feedback/Toast/Toast';
import { Card } from '../src/components/layout/Card/Card';
import { Dialog } from '../src/components/layout/Dialog/Dialog';
import { DropdownMenu } from '../src/components/layout/DropdownMenu/DropdownMenu';

registerReactHost({ Button, Card, Checkbox, Dialog, DropdownMenu, Input, Select, Toast });
