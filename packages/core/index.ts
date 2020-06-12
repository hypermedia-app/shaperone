import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import { createStore } from '@captaincodeman/rdx'
import { config } from './state/config'

// eslint-disable-next-line no-new
try { new EventTarget() } catch (e) { document.write('<script src="https://unpkg.com/@ungap/event-target@0.1.0/min.js"><\x2fscript>') }

export { dash } from './lib/dash'

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>

export const initialState = () => createStore(config)
