import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import reducers from './reducers'
import type { PropertyObjectState, PropertyState } from '../forms/index'
import type { Store } from '../../state'

export interface SingleEditorRenderParams<T extends Record<string, any> = Record<string, any>> {
  property: PropertyState
  value: PropertyObjectState<T>
}

export interface MultiEditorRenderParams<T extends Record<string, any> = Record<string, any>> {
  property: PropertyState
  componentState: T
}

export interface SingleEditorActions {
  updateComponentState(values: Record<string, any>): void
  update(newValue: Term | string): void
  focusOnObjectNode(): void
}

export interface MultiEditorActions {
  updateComponentState(values: Record<string, any>): void
  update(newValues: Array<Term | string>): void
  focusOnObjectNode(): void
}

export interface Component {
  editor: NamedNode
}

export interface RenderFunc<Params, Actions, TRenderResult> {
  (params: Params, actions: Actions): TRenderResult
}

export type RenderSingleEditor<TComponentState, TRenderResult> = RenderFunc<SingleEditorRenderParams<TComponentState>, SingleEditorActions, TRenderResult>
export type RenderMultiEditor<TComponentState, TRenderResult> = RenderFunc<MultiEditorRenderParams<TComponentState>, MultiEditorActions, TRenderResult>

export interface ComponentState extends Component {
  render?: RenderFunc<any, any, any>
  lazyRender?(): Promise<RenderFunc<any, any, any>>
  loading: boolean
  loadingFailed?: {
    reason: string
  }
}

interface ComponentRender<Params, Actions, TRenderResult> {
  render: RenderFunc<Params, Actions, TRenderResult>
}

export type SingleEditorComponent<TComponentState, TRenderResult> = Component & ComponentRender<SingleEditorRenderParams<TComponentState>, SingleEditorActions, TRenderResult>
export type MultiEditorComponent<TComponentState, TRenderResult> = Component & ComponentRender<MultiEditorRenderParams<TComponentState>, MultiEditorActions, TRenderResult>

export type Lazy<T extends ComponentRender<any, any, any>> = Omit<T, 'render'> & {
  lazyRender() : Promise<T['render']>
}

export type ComponentsState = Record<string, ComponentState>

export const components = createModel({
  state: <Record<string, ComponentState>>{},
  reducers,
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      async load(editor: NamedNode) {
        const state = store.getState()

        const component = state.components[editor.value]
        if (!component.lazyRender) {
          dispatch.components.loadingFailed({ editor, reason: 'lazyRender not implemented' })
          return
        }
        if (component.loading || component.loadingFailed) return

        try {
          dispatch.components.loaded({
            editor,
            render: await component.lazyRender(),
          })
        } catch (e) {
          dispatch.components.loadingFailed({ editor, reason: e.message })
        }
      },
    }
  },
})
