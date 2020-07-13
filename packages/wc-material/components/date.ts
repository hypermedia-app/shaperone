import { dash } from '@tpluscode/rdf-ns-builders'
import { createTextField } from './lib/textFieldFactory'

export const datePicker = createTextField(dash.DatePickerEditor, {
  type(): string {
    return 'date'
  },
})

export const dateTimePicker = createTextField(dash.DateTimePickerEditor, {
  type(): string {
    return 'datetime-local'
  },
})
