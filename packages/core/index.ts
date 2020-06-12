import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import { createStore } from '@captaincodeman/rdx'
import { config } from './state/config'

export { dash } from './lib/dash'

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>

export const initialState = () => createStore(config)
