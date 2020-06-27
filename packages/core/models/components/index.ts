import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import type { PropertyObjectState, PropertyState } from '../forms/index'

export interface EditorFactoryParams {
  property: PropertyState
  value: PropertyObjectState
}

export interface EditorFactoryActions {
  update(newValue: Term): void
  focusOnObjectNode(): void
}

export interface ComponentState<TRenderResult> extends Component<TRenderResult> {
  loaded: boolean
  loading: boolean
}

export interface Component<TRenderResult> {
  editor: NamedNode
  render(params: EditorFactoryParams, actions: EditorFactoryActions): TRenderResult
  loadDependencies?(): Array<Promise<unknown>>
}

export type ComponentsState<TRenderResult = any> = Record<string, ComponentState<TRenderResult>>

export const createComponentsModel = <TRenderResult>() => createModel({
  state: <ComponentsState<TRenderResult>>{},
  reducers: {
    loading(components, editor): ComponentsState {
      return {
        ...components,
        [editor.value]: {
          ...components[editor.value],
          loaded: false,
          loading: true,
        },
      }
    },
    loaded(components, editor): ComponentsState {
      return {
        ...components,
        [editor.value]: {
          ...components[editor.value],
          loaded: true,
          loading: false,
        },
      }
    },
    removeComponents(components, toRemove: NamedNode[]) {
      const newComponents = { ...components }
      toRemove.forEach((editor) => {
        delete newComponents[editor.value]
      })

      return newComponents
    },
    pushComponents(components, toAdd: Record<string, Component<TRenderResult>>): ComponentsState {
      const newComponents = Object.values(toAdd).reduce<ComponentsState>((reduced, component) => {
        if (!components[component.editor.value] || components[component.editor.value].render !== component.render) {
          return {
            ...reduced,
            [component.editor.value]: {
              ...component,
              loading: false,
              loaded: !component.loadDependencies,
            },
          }
        }

        return reduced
      }, {})

      if (!Object.keys(newComponents).some(Boolean)) {
        return components
      }

      return {
        ...components,
        ...newComponents,
      }
    },
  },
  effects(store) {
    const dispatch = store.dispatch()

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
