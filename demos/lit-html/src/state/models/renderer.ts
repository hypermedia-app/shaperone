import { createModel } from '@captaincodeman/rdx'

export interface RendererState {
  grouping: 'none' | 'material tabs' | 'vaadin accordion'
  nesting: 'none' | 'always one' | 'inline'
}

export const rendererSettings = createModel({
  state: <RendererState>{
    grouping: 'none',
    nesting: 'none',
  },
  reducers: {
    switchNesting(state, nesting: RendererState['nesting']) {
      return {
        ...state,
        nesting,
      }
    },
    switchLayout(state, grouping: RendererState['grouping']) {
      return {
        ...state,
        grouping,
      }
    },
  },
})
