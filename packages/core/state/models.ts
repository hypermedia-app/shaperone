import { createModel } from '@captaincodeman/rdx'
import $rdf from '@rdfjs/dataset'
import cf from 'clownface'
import * as DashEditors from '../DashEditors'
import * as reducers from './reducers'
import { FormState, Store } from '../state'
import { effects } from './effects'
import { EditorMap } from '../EditorMap'

export const form = createModel({
  state: <FormState>{
    editorMap: new EditorMap(DashEditors),
    compoundEditorMap: new EditorMap(),
    editors: {},
    focusNodes: {},
    focusStack: [],
    shapesGraph: cf({ dataset: $rdf.dataset() }),
  },
  reducers,
  effects: (store: Store) => effects(store.dispatch()),
})
