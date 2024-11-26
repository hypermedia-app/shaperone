import { dash } from '@tpluscode/rdf-ns-builders'
import type { CoreComponent } from '../components.js'
import { sort } from '../components.js'
import * as select from './base/instancesSelect.js'
import type { State, Editor } from './base/instancesSelect.js'

/**
 * Represents the state of an instances select component
 */
export interface InstancesSelect extends State {
}

export interface InstancesSelectEditor extends Editor<InstancesSelect> {
}

/**
 * A base implementation of Instances Select component which sets {@link InstancesSelect.ready} state flag the instances are first loaded.
 *
 * The instance data will be loaded from the shapes graph
 */
export const instancesSelect: CoreComponent<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  ...select,
  sort,
}
