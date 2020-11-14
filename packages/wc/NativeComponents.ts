import { dash } from '@tpluscode/rdf-ns-builders'
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

export const enumSelectEditor: Lazy<SingleEditorComponent> = {
  editor: dash.EnumSelectEditor,
  async lazyRender() {
    return (await import('./components')).enumSelect
  },
}

export const datePickerEditor: Lazy<SingleEditorComponent> = {
  editor: dash.DatePickerEditor,
  async lazyRender() {
    return (await import('./components')).datePicker
  },
}

export const instancesSelectEditor: Lazy<SingleEditorComponent> = {
  editor: dash.InstancesSelectEditor,
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
