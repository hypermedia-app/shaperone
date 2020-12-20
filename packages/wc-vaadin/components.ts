import { Lazy } from '@hydrofoil/shaperone-core'
import { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import {
  enumSelect,
  EnumSelectEditor,
  instancesSelect,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'

export const textField: Lazy<SingleEditorComponent> = {
  editor: dash.TextFieldEditor,
  lazyRender() {
    return import('./components/text-field').then(m => m.textField)
  },
}

export const textArea: Lazy<SingleEditorComponent> = {
  editor: dash.TextAreaEditor,
  lazyRender() {
    return import('./components/text-area').then(m => m.textArea)
  },
}

export const enumSelectEditor: Lazy<EnumSelectEditor> = {
  ...enumSelect,
  lazyRender() {
    return import('./components/enumSelect').then(m => m.enumSelect)
  },
}

export const instancesSelectEditor: Lazy<InstancesSelectEditor> = {
  ...instancesSelect,
  async init({ form, updateComponentState, property, value }) {
    if (value.object && !value.object.out().terms.length) {
      try {
        const instance = await this.loadInstance({ property: property.shape, value: value.object })
        if (instance) {
          property.shape.pointer
            .node(value.object)
            .addOut(form.labelProperties, instance.out(form.labelProperties))
        }
      } catch (e) {
        // failed to dereference existing value
      }
    }

    updateComponentState({
      ready: true,
    })
  },
  lazyRender() {
    return import('./components/instancesSelect').then(m => m.instancesSelect)
  },
}

export const datePicker: Lazy<SingleEditorComponent> = {
  editor: dash.DatePickerEditor,
  lazyRender() {
    return import('./components/date').then(m => m.datePicker)
  },
}

export const dateTimePicker: Lazy<SingleEditorComponent> = {
  editor: dash.DateTImePickerEditor,
  lazyRender() {
    return import('./components/date').then(m => m.dateTimePicker)
  },
}

export const urlEditor: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  lazyRender() {
    return import('./components/url-editor').then(m => m.urlEditor)
  },
}
