import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import { CoreComponent } from '../components.js'

/**
 * Instance state of URI component
 */
export interface URI extends ComponentInstance {
}

export interface URIEditor extends SingleEditorComponent<URI> {
}

/**
 * Extend to implement [DASH URI editor](http://datashapes.org/forms.html#URIEditor)
 */
export const uri: CoreComponent<URIEditor> = {
  editor: dash.URIEditor,
}
