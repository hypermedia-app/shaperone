/**
 * [DASH components](http://datashapes.org/forms.html) implemented using [Material Web Components](https://github.com/material-components/material-components-web-components)
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc-material/components
 */

import type { Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { BooleanSelectEditor, EnumSelectEditor, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import { booleanSelect, enumSelect, instancesSelect } from '@hydrofoil/shaperone-core/components.js'

/**
 * Renders an [mwc-textfield](https://material-components.github.io/material-components-web-components/demos/textfield/)
 */
export const textField: Lazy<SingleEditorComponent> = {
  editor: dash.TextFieldEditor,
  async lazyRender() {
    const { createTextField } = await import('./components/textField.js')
    return createTextField()
  },
}

/**
 * Renders an [mwc-textfield](https://material-components.github.io/material-components-web-components/demos/textfield/) with `type=url`
 */
export const urlEditor: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  async lazyRender() {
    const { createTextField } = await import('./components/textField.js')
    return createTextField({
      type: 'url',
      createTerm: (value, env) => env.namedNode(value),
    })
  },
}

/**
 * Renders an [mwc-textarea](https://material-components.github.io/material-components-web-components/demos/textarea/)
 */
export const textArea: Lazy<SingleEditorComponent> = {
  editor: dash.TextAreaEditor,
  lazyRender() {
    return import('./components/textArea.js').then(m => m.textArea)
  },
}

/**
 * Renders an [mwc-select](https://material-components.github.io/material-components-web-components/demos/select/)
 */
export const enumSelectEditor: Lazy<EnumSelectEditor> = {
  ...enumSelect,
  editor: dash.EnumSelectEditor,
  lazyRender() {
    return import('./components/select.js').then(m => m.enumSelect)
  },
}

/**
 * Renders an [mwc-select](https://material-components.github.io/material-components-web-components/demos/select/)
 */
export const booleanSelectEditor: Lazy<BooleanSelectEditor> = {
  ...booleanSelect,
  lazyRender() {
    return import('./components/select.js').then(m => m.booleanSelect)
  },
}

/**
 * Renders an [mwc-select](https://material-components.github.io/material-components-web-components/demos/select/)
 */
export const instancesSelectEditor: Lazy<InstancesSelectEditor> = {
  ...instancesSelect,
  editor: dash.InstancesSelectEditor,
  lazyRender() {
    return import('./components/select.js').then(m => m.instancesSelect)
  },
}

/**
 * Renders an [mwc-textfield](https://material-components.github.io/material-components-web-components/demos/textfield/) with `type=date`
 */
export const datePicker: Lazy<SingleEditorComponent> = {
  editor: dash.DatePickerEditor,
  async lazyRender() {
    const { createTextField } = await import('./components/textField.js')
    return createTextField({ type: 'date' })
  },
}

/**
 * Renders an [mwc-textfield](https://material-components.github.io/material-components-web-components/demos/textfield/) with `type=datetime-local`
 */
export const dateTimePicker: Lazy<SingleEditorComponent> = {
  editor: dash.DateTimePickerEditor,
  async lazyRender() {
    const { createTextField } = await import('./components/textField.js')
    return createTextField({ type: 'datetime-local' })
  },
}
