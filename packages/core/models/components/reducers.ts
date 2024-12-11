import { produce } from 'immer'
import type {
  ComponentsState,
  ComponentConstructor,
} from './index.js'

export default {
  pushComponents(components: ComponentsState, toAdd: Record<string, ComponentConstructor> | ComponentConstructor[]): ComponentsState {
    return produce(components, (newComponents) => {
      const addedArray = Array.isArray(toAdd) ? toAdd : Object.values(toAdd)

      for (const component of addedArray) {
        const previous = components.components[component.editor.value]
        const shouldAddComponent = !previous

        if (shouldAddComponent) {
          newComponents.components[component.editor.value] = component
        }
      }
    })
  },
}
