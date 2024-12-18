/**
 * [DASH components](http://datashapes.org/forms.html) implemented using [Vaadin Web Components](https://vaadin.com/components/)
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc-vaadin/components
 */

import type { Lazy } from '@hydrofoil/shaperone-core'
import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import type {
  AutoCompleteEditor,
  BooleanSelectEditor,
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components.js'
import {
  booleanSelect,
  enumSelect,
  instancesSelect,
} from '@hydrofoil/shaperone-core/components.js'

/**
 * Renders [`vaadin-text-field`](https://vaadin.com/components/vaadin-text-field/html-api/elements/Vaadin.TextFieldElement),
 * [`vaadin-number-field`](https://vaadin.com/components/vaadin-text-field/html-api/elements/Vaadin.NumberFieldElement)
 * or [`vaadin-integer-field`](https://vaadin.com/components/vaadin-text-field/html-api/elements/Vaadin.IntegerFieldElement) depending on the Property Shape
 */
export const textField: Lazy<SingleEditorComponent> = {
  editor: dash.TextFieldEditor,
  lazyRender() {
    return import('./components/text-field.js').then(m => m.textField)
  },
}

/**
 * Renders [`vaadin-area-area`](https://vaadin.com/components/vaadin-text-field/html-api/elements/Vaadin.TextAreaElement)
 */
export const textArea: Lazy<SingleEditorComponent> = {
  editor: dash.TextAreaEditor,
  lazyRender() {
    return import('./components/text-area.js').then(m => m.textArea)
  },
}

/**
 * Renders [`vaadin-select`](https://vaadin.com/components/vaadin-select/html-api/elements/Vaadin.SelectElement) displaying enum values
 */
export const enumSelectEditor: Lazy<EnumSelectEditor> = {
  ...enumSelect,
  lazyRender() {
    return import('./components/enumSelect.js').then(m => m.enumSelect)
  },
}

/**
 * Renders [`vaadin-select`](https://vaadin.com/components/vaadin-select/html-api/elements/Vaadin.SelectElement) displaying instances.
 */
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

/**
 * Renders [`vaadin-select`](https://vaadin.com/components/vaadin-select/html-api/elements/Vaadin.SelectElement) displaying true/false.
 */
export const booleanSelectEditor: Lazy<BooleanSelectEditor> = {
  ...booleanSelect,
  lazyRender() {
    return import('./components/booleanSelect.js').then(m => m.booleanSelect)
  },
}

/**
 * Renders [`vaadin-date-picker`](https://vaadin.com/components/vaadin-date-picker)
 */
export const datePicker: Lazy<SingleEditorComponent> = {
  editor: dash.DatePickerEditor,
  lazyRender() {
    return import('./components/date.js').then(m => m.datePicker)
  },
}

/**
 * Renders [`vaadin-date-time-picker`](https://vaadin.com/components/vaadin-date-time-picker)
 */
export const dateTimePicker: Lazy<SingleEditorComponent> = {
  editor: dash.DateTimePickerEditor,
  lazyRender() {
    return import('./components/date.js').then(m => m.dateTimePicker)
  },
}

/**
 * Renders a [`vaadin-text-field`](https://vaadin.com/components/vaadin-text-field/html-api/elements/Vaadin.TextFieldElement) with an
 * underlying `<input type=url>`
 */
export const urlEditor: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  lazyRender() {
    return import('./components/url-editor.js').then(m => m.urlEditor)
  },
}
