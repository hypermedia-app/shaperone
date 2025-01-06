/**
 * Provides very basic implementation of DASH components rendered as browser-native HTML elements:
 *
 * - `<input>`
 * - `<textarea>`
 * - `<select>`
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/NativeComponents
 */

import type { ComponentConstructor } from '@hydrofoil/shaperone-core/models/components/index.js'
import BooleanSelect from './elements/BooleanSelect.js'
import TextField from './elements/TextField.js'
import TextArea from './elements/TextArea.js'
import DatePicker from './elements/DatePicker.js'
import { Sh1Object } from './components/sh1-object.js'
import { Sh1Property } from './components/sh1-property.js'
import { Sh1FocusNode } from './components/sh1-focus-node.js'
import { Sh1Group } from './components/sh1-group.js'
import EnumSelect from './elements/EnumSelect.js'
import Sh1Button from './components/sh1-button.js'
import DateTimePicker from './elements/DateTimePicker.js'
import InstancesSelect from './elements/InstancesSelect.js'
import URIEditor from './elements/URIEditor.js'
import type { LayoutElements } from './renderer/model.js'

export const editors: Array<ComponentConstructor> = [
  TextField,
  TextArea,
  BooleanSelect,
  EnumSelect,
  DatePicker,
  DateTimePicker,
  InstancesSelect,
  URIEditor,
]

export const layoutComponents: LayoutElements = {
  'focus-node': Sh1FocusNode,
  property: Sh1Property,
  object: Sh1Object,
  group: Sh1Group,
  button: Sh1Button,
}
