import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import reducers from './reducers'
import type { PropertyObjectState, PropertyState } from '../forms/index'

export interface SingleEditorRenderParams {
  property: PropertyState
  value: PropertyObjectState
}

export interface MultiEditorRenderParams {
  property: PropertyState
}

export interface SingleEditorActions {
  update(newValue: Term | string): void
  focusOnObjectNode(): void
}

export interface MultiEditorActions {
  update(newValues: Array<Term | string>): void
  focusOnObjectNode(): void
}

export interface Component<TRenderResult> {
  editor: NamedNode
  render(...args: unknown[]): TRenderResult
  loadDependencies?(): Array<Promise<unknown>>
}

export interface ComponentState<TRenderResult> extends Component<TRenderResult> {
  loaded: boolean
  loading: boolean
}

export interface SingleEditorComponent<TRenderResult> extends Component<TRenderResult> {
  render(params: SingleEditorRenderParams, actions: SingleEditorActions): TRenderResult
}

export interface MultiEditorComponent<TRenderResult> extends Component<TRenderResult> {
  render(params: MultiEditorRenderParams, actions: MultiEditorActions): TRenderResult
}

export type ComponentsState<TRenderResult = any> = Record<string, ComponentState<TRenderResult>>

export const createComponentsModel = <TRenderResult>() => createModel({
  state: <ComponentsState<TRenderResult>>{},
  reducers: reducers<TRenderResult>(),
  effects(store) {
    const dispatch = store.getDispatch()

    return {
      async load(editor: NamedNode) {
        const state = store.getState()

        const component = state.components[editor.value]
        if (component.loading || component.loaded) return

        if (component.loadDependencies) {
          dispatch.components.loading(editor)
          await Promise.all(component.loadDependencies())
        }

        dispatch.components.loaded(editor)
      },
    }
  },
})
