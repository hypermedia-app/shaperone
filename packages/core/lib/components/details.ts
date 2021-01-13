import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of details component
 */
export interface Details extends ComponentInstance {
}

export interface DetailsEditor extends SingleEditorComponent<Details> {
}

/**
 * Extend to implement [DASH details editor](http://datashapes.org/forms.html#DetailsEditor)
 */
export const details: CoreComponent<DetailsEditor> = {
  editor: dash.DetailsEditor,
}
