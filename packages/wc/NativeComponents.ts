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

import type {
  EnumSelectEditor,
  InstancesSelectEditor,
  TextFieldEditor,
  TextAreaEditor,
  DatePickerEditor,
  DateTimePickerEditor,
  URIEditor,
  BooleanSelectEditor,
} from '@hydrofoil/shaperone-core/components.js'
import {
  instancesSelect,
  enumSelect,
  textField,
  textArea,
  datePicker,
  dateTimePicker,
  uri,
  booleanSelect,
} from '@hydrofoil/shaperone-core/components.js'
import type { Lazy } from './index.js'

export const nativeBooleanSelect: Lazy<BooleanSelectEditor> = {
  ...booleanSelect,
  async lazyRender() {
    return (await import('./components/index.js')).booleanSelect
  },
}

export const textFieldEditor: Lazy<TextFieldEditor> = {
  ...textField,
  async lazyRender() {
    return (await import('./components/index.js')).textField
  },
}

export const textAreaEditor: Lazy<TextAreaEditor> = {
  ...textArea,
  async lazyRender() {
    return (await import('./components/index.js')).textArea
  },
}

export const enumSelectEditor: Lazy<EnumSelectEditor> = {
  ...enumSelect,
  async lazyRender() {
    return (await import('./components/index.js')).enumSelect
  },
}

export const datePickerEditor: Lazy<DatePickerEditor> = {
  ...datePicker,
  async lazyRender() {
    return (await import('./components/index.js')).datePicker('date')
  },
}

export const dateTimePickerEditor: Lazy<DateTimePickerEditor> = {
  ...dateTimePicker,
  async lazyRender() {
    return (await import('./components/index.js')).datePicker('datetime-local')
  },
}

export const instancesSelectEditor: Lazy<InstancesSelectEditor> = {
  ...instancesSelect,
  async lazyRender() {
    return (await import('./components/index.js')).instancesSelect
  },
}

export const uriEditor: Lazy<URIEditor> = {
  ...uri,
  async lazyRender() {
    return (await import('./components/index.js')).uri
  },
}
