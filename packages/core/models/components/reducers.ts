import { produce } from 'immer'
import type {
  ComponentsState,
  ComponentConstructor,
  ComponentDecorator,
  Component,
} from './index.js'

export function decorate<T extends Component>(decorators: ComponentDecorator<T>[], component: ComponentConstructor<T>): ComponentConstructor<T> {
  const applicable = decorators.filter(({ applicableTo }) => applicableTo(component))
  return applicable.reduce((component: any, { decorate }: ComponentDecorator<T>) => decorate(component), component)
}

export default {
  pushComponents(components: ComponentsState, toAdd: Record<string, ComponentConstructor> | ComponentConstructor[]): ComponentsState {
    return produce(components, (newComponents) => {
      const addedArray = Array.isArray(toAdd) ? toAdd : Object.values(toAdd)

      for (const component of addedArray) {
        newComponents.components[component.editor.value] = decorate(components.decorators, component)
      }
    })
  },
  decorate<T extends Component>(components: ComponentsState, decorator: ComponentDecorator<T>) {
    return produce(components, (draft) => {
      draft.decorators.push(decorator)
      for (const [key, component] of Object.entries(components.components)) {
        if (decorator.applicableTo(component)) {
          draft.components[key] = decorate(draft.decorators, component)
        }
      }
    })
  },
}
