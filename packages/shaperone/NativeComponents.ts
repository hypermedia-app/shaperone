/**
 * Provides very basic implementation of DASH components rendered as browser-native HTML elements:
 *
 * - `<input>`
 * - `<textarea>`
 * - `<select>`
 *
 * @packageDocumentation
 * @module shaperone/NativeComponents
 */

import type { ComponentConstructor } from '@shaperone/core/models/components/index.js'
import BooleanSelect from './editors/BooleanSelect.js'
import TextField from './editors/TextField.js'
import TextArea from './editors/TextArea.js'
import DatePicker from './editors/DatePicker.js'
import { Sh1Object } from './components/sh1-object.js'
import { Sh1Property } from './components/sh1-property.js'
import { Sh1FocusNode } from './components/sh1-focus-node.js'
import { Sh1Group } from './components/sh1-group.js'
import EnumSelect from './editors/EnumSelect.js'
import Sh1Button from './components/sh1-button.js'
import DateTimePicker from './editors/DateTimePicker.js'
import InstancesSelect from './editors/InstancesSelect.js'
import URI from './editors/URI.js'
import type { LayoutElements } from './renderer/model.js'

export const editors: Array<ComponentConstructor> = [
  TextField,
  TextArea,
  BooleanSelect,
  EnumSelect,
  DatePicker,
  DateTimePicker,
  InstancesSelect,
  URI,
]

export const layoutComponents: LayoutElements = {
  'focus-node': Sh1FocusNode,
  property: Sh1Property,
  object: Sh1Object,
  group: Sh1Group,
  button: Sh1Button,
}
