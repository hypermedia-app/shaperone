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

export interface Component {
  editor: NamedNode
}

export interface RenderFunc<Params, Actions, TRenderResult> {
  (params: Params, actions: Actions): TRenderResult
}

export type RenderSingleEditor<TRenderResult> = RenderFunc<SingleEditorRenderParams, SingleEditorActions, TRenderResult>
export type RenderMultiEditor<TRenderResult> = RenderFunc<MultiEditorRenderParams, MultiEditorActions, TRenderResult>

export interface ComponentState<TRenderResult> extends Component {
  render?: RenderFunc<any, any, TRenderResult>
  lazyRender?(): Promise<RenderFunc<any, any, TRenderResult>>
  loading: boolean
  loadingFailed?: {
    reason: string
  }
}

interface ComponentRender<Params, Actions, TRenderResult> {
  render: RenderFunc<Params, Actions, TRenderResult>
}

export type SingleEditorComponent<TRenderResult> = Component & ComponentRender<SingleEditorRenderParams, SingleEditorActions, TRenderResult>
export type MultiEditorComponent<TRenderResult> = Component & ComponentRender<MultiEditorRenderParams, MultiEditorActions, TRenderResult>

export type Lazy<T extends ComponentRender<any, any, any>> = Omit<T, 'render'> & {
  lazyRender() : Promise<T['render']>
}

export type ComponentsState<TRenderResult = any> = Record<string, ComponentState<TRenderResult>>

export const createComponentsModel = <TRenderResult>() => createModel({
  state: <ComponentsState<TRenderResult>>{},
  reducers: reducers(),
  effects(store) {
    const dispatch = store.getDispatch()

    return {
      async load(editor: NamedNode) {
        const state = store.getState()

        const component: ComponentState<TRenderResult> = state.components[editor.value]
        if (!component.lazyRender) {
          dispatch.components.loadFailed({ editor, reason: 'lazyRender not implemented' })
          return
        }
        if (component.loading) return

        try {
          dispatch.components.loaded({
            editor,
            render: await component.lazyRender(),
          })
        } catch (e) {
          dispatch.components.loadFailed({ editor, reason: e.message })
        }
      },
    }
  },
})
