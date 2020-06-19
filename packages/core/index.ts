import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import { createStore } from '@captaincodeman/rdx'
import * as state from './state/config'

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>

export const createInstanceState = () => createStore(state.config)
