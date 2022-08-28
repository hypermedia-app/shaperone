import { createModel } from '@captaincodeman/rdx'

export interface ComponentsState {
  components: 'native' | 'material' | 'vaadin' | 'shoelace'
  disableEditorChoice: boolean
}

export const componentsSettings = createModel({
  state: <ComponentsState>{
    components: 'native',
    disableEditorChoice: false,
  },
  reducers: {
    switchComponents(state, components: ComponentsState['components']) {
      switch (components) {
        case 'material':
        case 'native':
        case 'vaadin':
        case 'shoelace':
          return { ...state, components }
        default:
          return state
      }
    },
    setEditorChoice(state, disableEditorChoice: boolean) {
      return {
        ...state,
        disableEditorChoice,
      }
    },
  },
})
