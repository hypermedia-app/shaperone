/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/components
 */

/* eslint-disable no-use-before-define */
import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from '@rdfjs/types'
import reducers from './reducers.js'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '../forms/index.js'

export interface Component {
  clear(): void
  property: PropertyState
  focusNode: FocusNodeState
}

export interface SingleEditorComponent<T extends Term = Term> extends Component {
  value: PropertyObjectState<T>
  setValue(value: T): void
}

export interface MultiEditorComponent<T extends Term = Term> extends Component {
  values: Array<PropertyObjectState<T>>
  setValues(values: T[]): void
}

export interface ComponentConstructor<T extends NamedNode = NamedNode> {
  editor: T
  extends?: NamedNode
}

export interface ComponentDecorator<T extends NamedNode = NamedNode> {
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
