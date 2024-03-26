import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import { CoreComponent } from '../components.js'

/**
 * Instance state of text field component
 */
export interface TextField extends ComponentInstance {
}

export interface TextFieldEditor extends SingleEditorComponent<TextField> {
}

/**
 * Extend to implement [DASH text field editor](http://datashapes.org/forms.html#TextFieldEditor)
 */
export const textField: CoreComponent<TextFieldEditor> = {
  editor: dash.TextFieldEditor,
}
