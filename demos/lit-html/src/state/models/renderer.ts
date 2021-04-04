import { createModel } from '@captaincodeman/rdx'

export interface RendererState {
  grouping: 'none' | 'material tabs' | 'vaadin accordion'
  nesting: 'none' | 'always one' | 'inline'
  labs?: {
    xone?: boolean
    errorSummary?: boolean
  }
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
    toggleLab({ labs = {}, ...state }, { lab, value } : {lab: keyof Required<RendererState>['labs']; value?: boolean}) {
      return {
        ...state,
        labs: {
          ...labs,
          [lab]: typeof value !== 'undefined' ? value : !labs[lab],
        },
      }
    },
  },
})
