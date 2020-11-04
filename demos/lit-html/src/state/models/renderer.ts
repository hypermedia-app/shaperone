import { createModel } from '@captaincodeman/rdx'

export interface RendererState {
  grouping: 'none' | 'material tabs' | 'vaadin accordion'
  nesting: 'none' | 'always one'
}

export const rendererSettings = createModel({
  state: <RendererState>{
    grouping: 'none',
    nesting: 'none',
  },
  reducers: {
    switchNesting(state, nesting: RendererState['nesting']) {
      switch (nesting) {
        case 'none':
        case 'always one':
          return {
            ...state,
            nesting,
          }
        default:
          return state
      }
    },
    switchLayout(state, grouping: RendererState['grouping']) {
      switch (grouping) {
        case 'material tabs':
        case 'none':
        case 'vaadin accordion':
          return {
            ...state,
            grouping,
          }
        default:
          return state
      }
    },
  },
})
