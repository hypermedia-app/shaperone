/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/components
 */

/* eslint-disable no-use-before-define */
import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import reducers from './reducers.js'
import type { PropertyObjectState } from '../forms/index.js'
import type { ObjectRenderer, PropertyRenderer } from '../../renderer.js'
import type { ShaperoneEnvironment } from '../../env.js'

export interface SingleEditorRenderParams {
  value: PropertyObjectState
  renderer: ObjectRenderer
}

export interface MultiEditorRenderParams {
  renderer: PropertyRenderer
}

export interface SingleEditorActions {
  update(newValue: GraphPointer | Term | string): void
  focusOnObjectNode(): void
  clear(): void
  remove(): void
}

export interface MultiEditorActions {
  update(newValues: Array<Term | string>): void
}

export interface Component {
  env: ShaperoneEnvironment
  clear(): void
}

export interface SingleEditorComponent extends Component {
  setValue(value: Term): void
}

export interface MultiEditorComponent extends Component {
}

export interface RenderFunc<Params, Actions, TRenderResult> {
  (params: Params, actions: Actions): TRenderResult
}

export interface ComponentConstructor {
  editor: NamedNode
  new(): Component
}

export interface ComponentsState {
  components: Record<string, ComponentConstructor>
}

export const components = createModel({
  state: <ComponentsState><any>{
    components: {},
  },
  reducers,
})
