/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/components
 */

/* eslint-disable no-use-before-define */
import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import reducers from './reducers'
import type { FormSettings, PropertyObjectState, PropertyState } from '../forms/index'
import type { Store } from '../../state'
import type { FocusNode } from '../../index'
import type { ObjectRenderer, PropertyRenderer } from '../../renderer'

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

export interface SingleEditorActions {
  update(newValue: Term | string): void
  focusOnObjectNode(): void
  clear(): void
  remove(): void
}

export interface SingleEditorRenderParams<T extends ComponentInstance = ComponentInstance> extends RenderParams<T> {
  value: PropertyObjectState<T>
  renderer: ObjectRenderer
  actions: SingleEditorActions
}

export interface MultiEditorActions {
  update(newValues: Array<Term | string>): void
  focusOnObjectNode(): void
}

export interface MultiEditorRenderParams<T extends ComponentInstance = ComponentInstance> extends RenderParams<T> {
  componentState: T
  renderer: PropertyRenderer
  actions: MultiEditorActions
}

export interface Component {
  /**
   * URI of the implemented DASH editor
   */
  editor: NamedNode
}

type ExtractState<T> = T extends SingleEditorComponent<infer TState>
  ? TState & T
  : T extends MultiEditorComponent<infer TState>
    ? TState & T
    : any

export interface RenderFunc<Params, TRenderResult> {
  (this: ExtractState<Params>, params: Params): TRenderResult
}

/**
 * Maps the component type to the type of its {@link RenderFunc}
 */
export type RenderComponent<T extends Component, TRenderResult> =
  T extends SingleEditorComponent<infer TState, TRenderResult>
    ? RenderFunc<SingleEditorRenderParams<TState>, TRenderResult>
    : T extends MultiEditorComponent<infer TState, TRenderResult>
      ? RenderFunc<MultiEditorRenderParams<TState>, TRenderResult>
      : RenderFunc<SingleEditorRenderParams, TRenderResult>

export interface ComponentState extends Component {
  init?(params: any): boolean
  render?: RenderFunc<any, any>
  lazyRender?(): Promise<RenderFunc<any, any>>
  loading: boolean
  loadingFailed?: {
    reason: string
  }
}

interface ComponentRender<Params extends RenderParams, TRenderResult> {
  render: RenderFunc<Params, TRenderResult>
}

interface ComponentInit<TParams> {
  init?: (params: TParams) => boolean
}

/**
 * Base interface for defining components implementing `dash:SingleEditor`
 */
export type SingleEditorComponent<TState extends ComponentInstance, TRenderResult = any> = Component
& ComponentRender<SingleEditorRenderParams<TState>, TRenderResult>
& ComponentInit<SingleEditorRenderParams<TState>>

/**
 * Base interface for defining components implementing `dash:MultiEditor`
 */
export type MultiEditorComponent<TState extends ComponentInstance, TRenderResult = any> = Component
& ComponentRender<MultiEditorRenderParams<TState>, TRenderResult>
& ComponentInit<MultiEditorRenderParams<TState>>

export type AnyComponent<TRenderResult = any> = Component
& ComponentRender<SingleEditorRenderParams<any> | MultiEditorRenderParams<any>, TRenderResult>
& ComponentInit<SingleEditorRenderParams<any> | MultiEditorRenderParams<any>>

/**
 * Use a base interface for components which need to execute asynchronous code before first render
 *
 * Typically used for dynamically importing dependencies
 *
 * @typeParam T actual component interface
 */
export type Lazy<T extends ComponentRender<any, any>> = Omit<T, 'render'> & {
  lazyRender() : Promise<(this: ExtractState<T> & T, ...args: Parameters<T['render']>) => ReturnType<T['render']>>
}

export interface ComponentExtension<TRenderResult, TComponent extends Component = AnyComponent<TRenderResult> | Lazy<AnyComponent<TRenderResult>>> {
  /**
   * Implement to customize the render output without differentiating between lazy and standard components
   *
   * @param render the actual {@link RenderFunc} of the decorated component
   */
  _decorateRender(render: RenderComponent<TComponent, TRenderResult>): RenderComponent<TComponent, TRenderResult>
}

/**
 * Returned by {@link ComponentDecorator.decorate}
 */
export type DecoratedComponent<TRenderResult, TComponent extends Component = AnyComponent<TRenderResult> | Lazy<AnyComponent<TRenderResult>>> =
  TComponent &
  Partial<ComponentExtension<TRenderResult, TComponent>>

export interface ComponentDecorator<T extends Component = AnyComponent | Lazy<AnyComponent>, TRenderResult = any> {
  applicableTo(component: Component): boolean
  decorate(component: T): DecoratedComponent<TRenderResult, T>
}

export interface ComponentsState {
  components: Record<string, ComponentState>
  decorators: ComponentDecorator<any>[]
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
