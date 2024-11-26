import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import type { CoreComponent } from '../components.js'

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
