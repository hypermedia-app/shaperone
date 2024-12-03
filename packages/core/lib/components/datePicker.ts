import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import type { CoreComponent } from '../components.js'

/**
 * Instance state of date picker component
 */
export interface DatePicker extends ComponentInstance {
}

export interface DatePickerEditor extends SingleEditorComponent<DatePicker> {
}

/**
 * Extend to implement [DASH date picker editor](http://datashapes.org/forms.html#DatePickerEditor)
 */
export const datePicker: CoreComponent<DatePickerEditor> = {
  editor: dash.DatePickerEditor,
}
