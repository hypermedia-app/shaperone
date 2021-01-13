import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of text area component
 */
export interface TextArea extends ComponentInstance {
}

export interface TextAreaEditor extends SingleEditorComponent<TextArea> {
}

/**
 * Extend to implement [DASH text area editor](http://datashapes.org/forms.html#TextAreaEditor)
 */
export const textArea: CoreComponent<TextAreaEditor> = {
  editor: dash.TextAreaEditor,
}
