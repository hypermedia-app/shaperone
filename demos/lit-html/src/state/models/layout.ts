import { createModel } from '@captaincodeman/rdx'

export const layout = createModel({
  state: {
    text: 'Layout',
    children: [{
      text: 'No grouping',
    }, {
      text: 'Material tabs',
    }, {
      text: 'Vaadin accordion',
    }],
  },
  reducers: {},
})
