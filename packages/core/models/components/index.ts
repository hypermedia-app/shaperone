import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import reducers from './reducers'
import type { FormSettings, FormState, PropertyObjectState, PropertyState } from '../forms/index'
import type { Store } from '../../state'
import type { FocusNode } from '../../index'

export interface TComponentState extends Record<string, any> {
  ready?: boolean
}

export interface SingleEditorRenderParams<T extends TComponentState = TComponentState> {
  form: FormSettings
  focusNode: FocusNode
  property: PropertyState
  value: PropertyObjectState<T>
}

export interface MultiEditorRenderParams<T extends Record<string, any> = Record<string, any>> {
  form: FormSettings
  focusNode: FocusNode
  property: PropertyState
  componentState: T
}

export interface UpdateComponentState<T extends TComponentState = TComponentState> {
  (values: Partial<T>): void
}

export interface SingleEditorActions<TState extends TComponentState> {
  updateComponentState: UpdateComponentState<TState>
  update(newValue: Term | string): void
  focusOnObjectNode(): void
}

export interface MultiEditorActions<TState extends TComponentState> {
  updateComponentState: UpdateComponentState<TState>
  update(newValues: Array<Term | string>): void
  focusOnObjectNode(): void
}

export interface Component<TState extends TComponentState = TComponentState> {
  editor: NamedNode
  init?(params: {
    form: FormState
    updateComponentState: UpdateComponentState<TState>
    component: Component
    focusNode: FocusNode
    property: PropertyState
    componentState: TState
    value: PropertyObjectState<TState>
  }): void
}

export interface ComponentDecorator<T extends Component = Component> {
  applicableTo(component: Component): boolean
  decorate(component: T): T
}

export interface RenderFunc<Params, Actions, TRenderResult> {
  (params: Params, actions: Actions): TRenderResult
}

export type RenderSingleEditor<TState extends TComponentState, TRenderResult> = RenderFunc<SingleEditorRenderParams<TState>, SingleEditorActions<TState>, TRenderResult>
export type RenderMultiEditor<TState extends TComponentState, TRenderResult> = RenderFunc<MultiEditorRenderParams<TState>, MultiEditorActions<TState>, TRenderResult>

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

export type SingleEditorComponent<TState extends TComponentState, TRenderResult> = Component<TState> & ComponentRender<SingleEditorRenderParams<TState>, SingleEditorActions<TState>, TRenderResult>
export type MultiEditorComponent<TState extends TComponentState, TRenderResult> = Component<TState> & ComponentRender<MultiEditorRenderParams<TState>, MultiEditorActions<TState>, TRenderResult>

export type Lazy<T extends ComponentRender<any, any, any>> = Omit<T, 'render'> & {
  lazyRender() : Promise<T['render']>
}

export interface ComponentsState {
  components: Record<string, ComponentState>
  decorators: ComponentDecorator[]
}

export const components = createModel({
  state: <ComponentsState>{
    components: {},
    decorators: [],
  },
  reducers,
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      async load(editor: NamedNode) {
        const state = store.getState()

        const component = state.components.components[editor.value]
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
