import { createModel } from '@captaincodeman/rdx'
import { FormState, Store } from '../../state'
import { EditorMap } from '../../EditorMap'
import * as DashEditors from '../../DashEditors'
import * as reducers from './reducers'
import { effects } from './effects'

export const form = createModel({
  state: <FormState>{
    editorMap: new EditorMap(DashEditors),
    compoundEditorMap: new EditorMap(),
    editors: {},
    focusNodes: {},
    focusStack: [],
  },
  reducers,
  effects: (store: Store) => effects(store.dispatch()),
})
