import produce from 'immer'
import { NamedNode } from 'rdf-js'
import type { Component, ComponentsState, RenderFunc } from './index'

export default function () {
  return {
    loading(components: ComponentsState, editor: NamedNode): ComponentsState {
      return produce(components, (draft) => {
        draft[editor.value].loading = true
      })
    },
    loadingFailed(components: ComponentsState, { editor, reason }: { editor: NamedNode; reason: string }): ComponentsState {
      return produce(components, (draft) => {
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
    pushComponents(components: ComponentsState, toAdd: Record<string, Component> | Component[]): ComponentsState {
      return produce(components, (newComponents) => {
        const addedArray = Array.isArray(toAdd) ? toAdd : Object.values(toAdd)

        for (const component of addedArray) {
          if (!components[component.editor.value]) {
            newComponents[component.editor.value] = {
              ...component,
              loading: false,
            }
          }
        }
      })
    },
  }
}
