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

import {
  instancesSelect,
  enumSelect,
  EnumSelectEditor,
  InstancesSelectEditor,
  TextFieldEditor,
  TextAreaEditor,
  textField,
  textArea,
  datePicker,
  DatePickerEditor,
  DateTimePickerEditor,
  dateTimePicker,
  uri,
  URIEditor,
  BooleanSelectEditor,
  booleanSelect,
} from '@hydrofoil/shaperone-core/components'
import type { Lazy } from './index.js'

export const nativeBooleanSelect: Lazy<BooleanSelectEditor> = {
  ...booleanSelect,
  async lazyRender() {
    return (await import('./components')).booleanSelect
  },
}

export const textFieldEditor: Lazy<TextFieldEditor> = {
  ...textField,
  async lazyRender() {
    return (await import('./components')).textField
  },
}

export const textAreaEditor: Lazy<TextAreaEditor> = {
  ...textArea,
  async lazyRender() {
    return (await import('./components')).textArea
  },
}

export const enumSelectEditor: Lazy<EnumSelectEditor> = {
  ...enumSelect,
  async lazyRender() {
    return (await import('./components')).enumSelect
  },
}

export const datePickerEditor: Lazy<DatePickerEditor> = {
  ...datePicker,
  async lazyRender() {
    return (await import('./components')).datePicker('date')
  },
}

export const dateTimePickerEditor: Lazy<DateTimePickerEditor> = {
  ...dateTimePicker,
  async lazyRender() {
    return (await import('./components')).datePicker('datetime-local')
  },
}

export const instancesSelectEditor: Lazy<InstancesSelectEditor> = {
  ...instancesSelect,
  async lazyRender() {
    return (await import('./components')).instancesSelect
  },
}

export const uriEditor: Lazy<URIEditor> = {
  ...uri,
  async lazyRender() {
    return (await import('./components')).uri
  },
}
