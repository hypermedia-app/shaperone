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

import BooleanSelect from './elements/BooleanSelect.js'
import TextField from './elements/TextField.js'
import TextArea from './elements/TextArea.js'
import { Sh1Form } from './components/sh1-form.js'
import { Sh1Object } from './components/sh1-object.js'
import { Sh1Property } from './components/sh1-property.js'
import { Sh1FocusNode } from './components/sh1-focus-node.js'
import EnumSelect from './elements/EnumSelect.js'
import Sh1Button from './components/sh1-button.js'

export const editors = [
  TextField,
  TextArea,
  BooleanSelect,
  EnumSelect,
]

export const layoutComponents = {
  form: Sh1Form,
  focusNode: Sh1FocusNode,
  property: Sh1Property,
  object: Sh1Object,
  button: Sh1Button,
}
