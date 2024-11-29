import { produce } from 'immer'
import type { NamedNode } from '@rdfjs/types'
import type {
  ComponentsState,
  ComponentState,
  RenderFunc,
  ComponentDecorator,
  Component,
} from './index.js'
import { decorateComponent } from './lib/decorate.js'
import type { ShaperoneEnvironment } from '../../env.js'
import env from '../../env.js'

type _Component = Omit<ComponentState, 'loading' | 'loadingFailed'>

export function decorate<T extends _Component>(decorators: ComponentDecorator<T>[], component: T, env: ShaperoneEnvironment): T {
  const applicable = decorators.filter(({ applicableTo }) => applicableTo(component))
  return applicable.reduce((component: any, decorator: any) => decorateComponent(component, decorator, env), component)
}

export default {
  loading(components: ComponentsState, editor: NamedNode): ComponentsState {
    return produce(components, (draft) => {
      draft.components[editor.value].loading = true
    })
  },
  loadingFailed(components: ComponentsState, { editor, reason }: { editor: NamedNode; reason: string }): ComponentsState {
    return produce(components, (draft) => {
      draft.components[editor.value].loading = false
      draft.components[editor.value].loadingFailed = {
        reason,
      }
    })
  },
  loaded(components: ComponentsState, { editor, render } : {editor: NamedNode; render: RenderFunc<any, any, any>}): ComponentsState {
    return produce(components, (draft) => {
      draft.components[editor.value].loading = false
      draft.components[editor.value].render = render
      draft.components[editor.value].loadingFailed = undefined
    })
  },
  removeComponents(components: ComponentsState, toRemove: NamedNode[]) {
    return produce(components, (newComponents) => {
      for (const editor of toRemove) {
        delete newComponents.components[editor.value]
      }
    })
  },
  pushComponents(components: ComponentsState, toAdd: Record<string, _Component> | _Component[]): ComponentsState {
    return produce(components, (newComponents) => {
      const addedArray = Array.isArray(toAdd) ? toAdd : Object.values(toAdd)

      for (const component of addedArray) {
        const previous = components.components[component.editor.value]
        const shouldAddComponent = !previous ||
        (previous.lazyRender && component.lazyRender && previous.lazyRender !== component.lazyRender) ||
        (previous.render && component.render && previous.render !== component.render) ||
        ((previous.render && !component.render) || (previous.lazyRender || !component.lazyRender))

        if (shouldAddComponent) {
          newComponents.components[component.editor.value] = {
            ...decorate(components.decorators, component, env()),
            loading: false,
          }
        }
      }
    })
  },
  decorate<T extends Component>(components: ComponentsState, decorator: ComponentDecorator<T>) {
    return produce(components, (draft) => {
      draft.decorators.push(decorator)
      for (const [key, component] of Object.entries(components.components)) {
        if (decorator.applicableTo(component)) {
          draft.components[key] = {
            ...component,
            ...decorate(draft.decorators, component, env()),
          }
        }
      }
    })
  },
}
