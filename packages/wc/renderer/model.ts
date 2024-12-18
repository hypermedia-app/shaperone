import { createModel } from '@hydrofoil/shaperone-core/store.js'
import type { FocusNodeElement, ObjectElement, PropertyElement } from '../components/index.js'

type Constructor<T> = new (...args: any[]) => T

export interface LayoutElements {
  object: Constructor<ObjectElement>
  property: Constructor<PropertyElement>
  'focus-node': Constructor<FocusNodeElement>
  [key: string]: CustomElementConstructor
}

export interface RendererState {
  layoutElements: LayoutElements
}

export const renderer = createModel({
  state: <RendererState>{
    layoutElements: {},
  },
  reducers: {
    pushComponents(state, layoutElements: LayoutElements) {
      return {
        ...state,
        layoutElements: {
          ...state.layoutElements,
          ...layoutElements,
        },
      }
    },
  },
})
