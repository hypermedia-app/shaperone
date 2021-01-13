import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of date-time picker component
 */
export interface DateTimePicker extends ComponentInstance {
}

export interface DateTimePickerEditor extends SingleEditorComponent<DateTimePicker> {
}

/**
 * Extend to implement [DASH date-time picker editor](http://datashapes.org/forms.html#DateTimePickerEditor)
 */
export const dateTimePicker: CoreComponent<DateTimePickerEditor> = {
  editor: dash.DateTimePickerEditor,
}
