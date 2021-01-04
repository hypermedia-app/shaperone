/* eslint-disable no-use-before-define */
import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import reducers from './reducers'
import type { FormSettings, PropertyObjectState, PropertyState } from '../forms/index'
import type { Store } from '../../state'
import type { FocusNode } from '../../index'

export interface ComponentInstance extends Record<string, any> {
  ready?: boolean
}

export interface UpdateComponentState<T extends ComponentInstance = ComponentInstance> {
  (values: Partial<T>): void
}

export interface RenderParams<T extends ComponentInstance = ComponentInstance> {
  form: FormSettings
  focusNode: FocusNode
  property: PropertyState
  updateComponentState: UpdateComponentState<T>
}

export interface SingleEditorRenderParams<T extends ComponentInstance = ComponentInstance> extends RenderParams<T> {
  value: PropertyObjectState<T>
}

export interface MultiEditorRenderParams<T extends ComponentInstance = ComponentInstance> extends RenderParams<T> {
  componentState: T
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

export interface ComponentDecorator<T extends Component = Component> {
  applicableTo(component: Component): boolean
  decorate(component: T): T
}

type ExtractState<T> = T extends SingleEditorComponent<infer TState, any>
  ? TState & T
  : T extends MultiEditorComponent<infer TState, any>
    ? TState & T
    : any

export interface RenderFunc<Params, Actions, TRenderResult> {
  (this: ExtractState<Params>, params: Params, actions: Actions): TRenderResult
}

export type RenderComponent<T extends Component, TRenderResult> =
  T extends SingleEditorComponent<infer TState, TRenderResult>
    ? RenderFunc<SingleEditorRenderParams<TState>, SingleEditorActions, TRenderResult>
    : T extends MultiEditorComponent<infer TState, TRenderResult>
      ? RenderFunc<MultiEditorRenderParams<TState>, MultiEditorActions, TRenderResult>
      : RenderFunc<SingleEditorRenderParams, SingleEditorActions, TRenderResult>

export interface ComponentState extends Component {
  init?(params: any): boolean
  render?: RenderFunc<any, any, any>
  lazyRender?(): Promise<RenderFunc<any, any, any>>
  loading: boolean
  loadingFailed?: {
    reason: string
  }
}

interface ComponentRender<Params extends RenderParams, Actions, TRenderResult> {
  render: RenderFunc<Params, Actions, TRenderResult>
}

interface ComponentInit<TParams> {
  init?(params: TParams): boolean
}

export type SingleEditorComponent<TState extends ComponentInstance, TRenderResult = any> = Component
& ComponentRender<SingleEditorRenderParams<TState>, SingleEditorActions, TRenderResult>
& ComponentInit<SingleEditorRenderParams<TState>>
export type MultiEditorComponent<TState extends ComponentInstance, TRenderResult = any> = Component
& ComponentRender<MultiEditorRenderParams<TState>, MultiEditorActions, TRenderResult>
& ComponentInit<MultiEditorRenderParams<TState>>

export type Lazy<T extends ComponentRender<any, any, any>> = Omit<T, 'render'> & {
  lazyRender() : Promise<(this: ExtractState<T> & T, ...args: Parameters<T['render']>) => ReturnType<T['render']>>
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
