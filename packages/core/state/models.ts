import { createModel } from '@captaincodeman/rdx'
import * as DashEditors from '../DashEditors'
import * as reducers from './reducers'
import { Store } from '../state'
import { effects } from './effects'
import { EditorMap } from '../EditorMap'

export const form = createModel({
  state: {
    editorMap: new EditorMap(DashEditors),
    compoundEditorMap: new EditorMap(),
    editors: {},
    focusNodes: {},
  },
  reducers,
  effects: (store: Store) => effects(store.dispatch()),
})
