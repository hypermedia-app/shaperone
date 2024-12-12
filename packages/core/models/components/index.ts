/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/components
 */

/* eslint-disable no-use-before-define */
import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import reducers from './reducers.js'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '../forms/index.js'
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
  property: PropertyState
  value: PropertyObjectState
  focusNode: FocusNodeState
}

export interface SingleEditorComponent extends Component {
  setValue(value: Term): void
}

export interface MultiEditorComponent extends Component {
}

export interface ComponentConstructor<T extends Component = Component> {
  editor: NamedNode
  new(): T
}

export interface ComponentDecorator<T extends Component = Component> {
  applicableTo(component: ComponentConstructor): boolean
  decorate(component: ComponentConstructor<T>): ComponentConstructor<T>
}

export interface ComponentsState {
  components: Record<string, ComponentConstructor>
  decorators: ComponentDecorator[]
}

export const components = createModel({
  state: <ComponentsState>{
    components: {},
    decorators: [],
  },
  reducers,
})
