import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of auto complete components
 */
export interface AutoComplete extends ComponentInstance {
}

export interface AutoCompleteEditor extends SingleEditorComponent<AutoComplete> {
}

/**
 * Extend to implement [DASH auto complete editor](http://datashapes.org/forms.html#AutoCompleteEditor)
 */
export const autoComplete: CoreComponent<AutoCompleteEditor> = {
  editor: dash.AutoCompleteEditor,
}
