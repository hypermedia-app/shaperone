import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import { CoreComponent } from '../components.js'

/**
 * Instance state of boolean select component
 */
export interface BooleanSelect extends ComponentInstance {
}

export interface BooleanSelectEditor extends SingleEditorComponent<BooleanSelect> {
}

/**
 * Extend to implement [DASH boolean select editor](http://datashapes.org/forms.html#BooleanSelectEditor)
 */
export const booleanSelect: CoreComponent<BooleanSelectEditor> = {
  editor: dash.BooleanSelectEditor,
}
