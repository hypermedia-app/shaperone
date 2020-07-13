import { dash } from '@tpluscode/rdf-ns-builders'
import { getType } from './lib/textFieldType'
import { createTextField } from './lib/textFieldFactory'

export const textField = createTextField(dash.TextFieldEditor, {
  type({ property }) {
    return getType(property.datatype)
  },
})
