import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of text field with lang component
 */
export interface TextFieldWithLang extends ComponentInstance {
}

export interface TextFieldWithLangEditor extends SingleEditorComponent<TextFieldWithLang> {
}

/**
 * Extend to implement [DASH text field editor](http://datashapes.org/forms.html#TextFieldWithLangEditor)
 */
export const textFieldWithLang: CoreComponent<TextFieldWithLangEditor> = {
  editor: dash.TextFieldWithLangEditor,
}
