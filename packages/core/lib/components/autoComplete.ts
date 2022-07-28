import { dash } from '@tpluscode/rdf-ns-builders'
import { CoreComponent, sort } from '../components.js'
import * as select from './base/instancesSelect.js'
import type { State, Editor } from './base/instancesSelect.js'

/**
 * Represents the state of an instances select component
 */
export interface AutoComplete extends State {
  freetextQuery?: string
}

export interface AutoCompleteEditor extends Editor<AutoComplete> {
}

/**
 * A base implementation of Instances Select component which sets {@link InstancesSelect.ready} state flag the instances are first loaded.
 *
 * The instance data will be loaded from the shapes graph
 */
export const autoComplete: CoreComponent<AutoCompleteEditor> = {
  editor: dash.AutoCompleteEditor,
  ...select,
  sort,
}
