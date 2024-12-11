import { createModel } from '@hydrofoil/shaperone-core/store.js'

type LayoutElementConstructor = new (...args: any[]) => HTMLElement

type LayoutElements = Record<string, LayoutElementConstructor>

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
