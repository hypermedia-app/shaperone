import produce from 'immer'
import { NamedNode } from 'rdf-js'
import type { ComponentsState, ComponentState, RenderFunc, Decorator, Component } from './index'

type _Component = Omit<ComponentState, 'loading' | 'loadingFailed'>

export default {
  loading(components: ComponentsState, editor: NamedNode): ComponentsState {
    return produce(components, (draft) => {
      draft[editor.value].loading = true
    })
  },
  loadingFailed(components: ComponentsState, { editor, reason }: { editor: NamedNode; reason: string }): ComponentsState {
    return produce(components, (draft) => {
      draft[editor.value].loading = false
      draft[editor.value].loadingFailed = {
        reason,
      }
    })
  },
  loaded(components: ComponentsState, { editor, render } : {editor: NamedNode; render: RenderFunc<any, any, any>}): ComponentsState {
    return produce(components, (draft) => {
      draft[editor.value].loading = false
      draft[editor.value].render = render
      draft[editor.value].loadingFailed = undefined
    })
  },
  removeComponents(components: ComponentsState, toRemove: NamedNode[]) {
    return produce(components, (newComponents) => {
      for (const editor of toRemove) {
        delete newComponents[editor.value]
      }
    })
  },
  pushComponents(components: ComponentsState, toAdd: Record<string, _Component> | _Component[]): ComponentsState {
    return produce(components, (newComponents) => {
      const addedArray = Array.isArray(toAdd) ? toAdd : Object.values(toAdd)

      for (const component of addedArray) {
        const previous = components[component.editor.value]
        const shouldAddComponent = !previous ||
        (previous.lazyRender && component.lazyRender && previous.lazyRender !== component.lazyRender) ||
        (previous.render && component.render && previous.render !== component.render) ||
        ((previous.render && !component.render) || (previous.lazyRender || !component.lazyRender))

        if (shouldAddComponent) {
          newComponents[component.editor.value] = {
            ...component,
            loading: false,
          }
        }
      }
    })
  },
  decorate<T extends Component = Component>(components: ComponentsState, decorator: Decorator<T>) {
    return produce(components, (decorated) => {
      for (const [key, component] of Object.entries(components)) {
        if (decorator.applicableTo(component)) {
          decorated[key] = {
            ...component,
            ...decorator.decorate(component as unknown as T),
          }
        }
      }
    })
  },
}
