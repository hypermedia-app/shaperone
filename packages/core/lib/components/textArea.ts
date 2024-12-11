import { dash } from '@tpluscode/rdf-ns-builders'
import type { Component } from '../../models/components/index.js'

export interface TextArea extends Component {
}

/**
 * Extend to implement [DASH text area editor](http://datashapes.org/forms.html#TextAreaEditor)
 */
export const textArea: CoreComponent<TextArea> = {
  editor: dash.TextAreaEditor,
}
