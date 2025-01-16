import { createModel } from '@hydrofoil/shaperone-core/store.js'
import type { FocusNodeElement, ObjectElement, PropertyElement, PropertyGroupElement } from '../components/index.js'

type Constructor<T> = new (...args: any[]) => T

export interface LayoutElements {
  object: Constructor<ObjectElement>
  property: Constructor<PropertyElement>
  group: Constructor<PropertyGroupElement>
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
    pushComponents(state, layoutElements: Partial<LayoutElements>) {
      return {
        ...state,
        layoutElements: <LayoutElements>{
          ...state.layoutElements,
          ...layoutElements,
        },
      }
    },
  },
})
