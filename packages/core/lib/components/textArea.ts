import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import type { CoreComponent } from '../components.js'

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
