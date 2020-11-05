import produce from 'immer'
import { NamedNode } from 'rdf-js'
import type { Component, ComponentsState } from './index'

export default function <TRenderResult> () {
  return {
    loading(components: ComponentsState, editor: NamedNode): ComponentsState {
      return produce(components, (draft) => {
        draft[editor.value].loaded = false
        draft[editor.value].loading = true
      })
    },
    loaded(components: ComponentsState, editor: NamedNode): ComponentsState {
      return produce(components, (draft) => {
        draft[editor.value].loaded = true
        draft[editor.value].loading = false
      })
    },
    removeComponents(components: ComponentsState, toRemove: NamedNode[]) {
      return produce(components, (newComponents) => {
        for (const editor of toRemove) {
          delete newComponents[editor.value]
        }
      })
    },
    pushComponents(components: ComponentsState, toAdd: Record<string, Component<TRenderResult>> | Component<TRenderResult>[]): ComponentsState {
      return produce(components, (newComponents) => {
        const addedArray = Array.isArray(toAdd) ? toAdd : Object.values(toAdd)

        for (const component of addedArray) {
          if (!components[component.editor.value] || components[component.editor.value].render !== component.render) {
            newComponents[component.editor.value] = {
              ...component,
              loading: false,
              loaded: !component.loadDependencies,
            }
          }
        }
      })
    },
  }
}
