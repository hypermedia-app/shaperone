import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of blank node component
 */
export interface BlankNode extends ComponentInstance {
}

export interface BlankNodeEditor extends SingleEditorComponent<BlankNode> {
}

/**
 * Extend to implement [DASH blank node editor](http://datashapes.org/forms.html#BlankNodeEditor)
 */
export const blankNode: CoreComponent<BlankNodeEditor> = {
  editor: dash.BlankNodeEditor,
}
