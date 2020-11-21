import { dash } from '@tpluscode/rdf-ns-builders'
import {
  instancesSelect,
  enumSelect,
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import type { SingleEditorComponent, Lazy } from './index'

export const textFieldEditor: Lazy<SingleEditorComponent> = {
  editor: dash.TextFieldEditor,
  async lazyRender() {
    return (await import('./components')).textField
  },
}

export const textAreaEditor: Lazy<SingleEditorComponent> = {
  editor: dash.TextAreaEditor,
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

export const datePickerEditor: Lazy<SingleEditorComponent> = {
  editor: dash.DatePickerEditor,
  async lazyRender() {
    return (await import('./components')).datePicker('date')
  },
}

export const dateTimePickerEditor: Lazy<SingleEditorComponent> = {
  editor: dash.DateTimePickerEditor,
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

export const uriEditor: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  async lazyRender() {
    return (await import('./components')).uri
  },
}
