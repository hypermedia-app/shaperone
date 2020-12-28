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
  init({ form, property, value, updateComponentState }) {
    const { object } = value

    if (!value.componentState.ready && !value.componentState.loading && object && object.term.termType === 'NamedNode' && !object.out().terms.length) {
      updateComponentState({
        loading: true,
        ready: false,
      });
      (async () => {
        try {
          const instance = await this.loadInstance({ property: property.shape, value: object })
          if (instance) {
            const objectNode = property.shape.pointer.node(object)
            for (const labelProperty of form.labelProperties) {
              objectNode.addOut(labelProperty, instance.out(labelProperty))
            }
          }
        } catch (e) {
          updateComponentState({
            loading: false,
            ready: true,
          })
        }
      })()

      return false
    }
    if (!value.componentState.ready) {
      updateComponentState({
        loading: false,
        ready: true,
      })
    }

    return !!value.componentState.ready
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
