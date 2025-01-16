/**
 * [DASH components](http://datashapes.org/forms.html) implemented using [Vaadin Web Components](https://vaadin.com/components/)
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc-vaadin/components
 */

export { default as BooleanSelect } from './components/BooleanSelectEditor.js'
export { default as DateTimePicker } from './components/DateTimePickerEditor.js'
export { default as DatePicker } from './components/DatePickerEditor.js'

/**
export const textField: Lazy<SingleEditorComponent> = {
  editor: dash.TextFieldEditor,
  lazyRender() {
    return import('./components/text-field.js').then(m => m.textField)
  },
}

export const textArea: Lazy<SingleEditorComponent> = {
  editor: dash.TextAreaEditor,
  lazyRender() {
    return import('./components/text-area.js').then(m => m.textArea)
  },
}

export const enumSelectEditor: Lazy<EnumSelectEditor> = {
  ...enumSelect,
  lazyRender() {
    return import('./components/enumSelect.js').then(m => m.enumSelect)
  },
}

export const instancesSelectEditor: Lazy<InstancesSelectEditor> = {
  ...instancesSelect,
  init({ env, form, property, value, componentState, updateComponentState }) {
    const { object } = value

    if (!componentState.ready && !componentState.loading && object && object.term.termType === 'NamedNode' && !object.out().terms.length) {
      updateComponentState({
        loading: true,
        ready: false,
      });
      (async () => {
        try {
          const instance = await this.loadInstance({ env, property: property.shape, value: object })
          if (instance) {
            const objectNode = property.shape.pointer.node(object)
            for (const labelProperty of form.labelProperties) {
              objectNode.addOut(labelProperty, instance.out(labelProperty))
            }
            updateComponentState({
              selectedInstance: undefined,
            })
          }
        } finally {
          updateComponentState({
            loading: false,
            ready: true,
          })
        }
      })()

      return false
    }
    if (!componentState.ready) {
      updateComponentState({
        loading: false,
        ready: true,
      })
    }

    return !!componentState.ready
  },
  lazyRender() {
    return import('./components/instancesSelect.js').then(m => m.instancesSelect)
  },
}

export const autoComplete: Lazy<AutoCompleteEditor> = {
  ...instancesSelectEditor,
  editor: dash.AutoCompleteEditor,
}

export const urlEditor: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  lazyRender() {
    return import('./components/url-editor.js').then(m => m.urlEditor)
  },
}
*/
