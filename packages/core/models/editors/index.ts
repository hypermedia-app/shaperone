import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import { PropertyShape } from '@rdfine/shacl'
import type * as Rdfs from '@rdfine/rdfs'
import * as $rdf from '@rdf-esm/dataset'
import type { AnyPointer } from 'clownface'
import type { Dispatch, Store } from '../../state'
import { addMatchers } from './reducers/addMatchers'
import { addMetadata } from './reducers/addMetadata'
import * as addObject from '../forms/reducers/addObject'
import { matchEditors } from './lib/match'
import * as updatePropertyObjects from '../forms/reducers/updatePropertyObjects'
import { updatePropertyEditors } from './lib/updatePropertyEditors'

function toDefined<T>(arr: T[], next: T | undefined): T[] {
  if (!next) {
    return arr
  }

  return [...arr, next]
}

// todo: re-export from main module
export interface EditorMatcher {
  term: NamedNode
}

export interface MultiEditor extends EditorMatcher {
  match: (shape: PropertyShape) => number | null
}

export interface SingleEditor<T extends Term = Term> extends EditorMatcher {
  match: (shape: PropertyShape, value: T) => number | null
}

export type Editor<T extends EditorMatcher = SingleEditor | MultiEditor> = T & {
  meta: Rdfs.Resource
}

export interface SingleEditorMatch extends SingleEditor {
  score: number | null
}

type EditorMap<T> = Record<string, T | undefined>

export interface EditorsState {
  metadata: AnyPointer
  allEditors: EditorMap<Editor<EditorMatcher>>
  singleEditors: EditorMap<Editor<SingleEditor>>
  multiEditors: EditorMap<Editor<MultiEditor>>
}

export const editors = createModel(({
  state: <EditorsState>{
    multiEditors: {},
    singleEditors: {},
    allEditors: {},
  },
  reducers: {
    addMetadata,
    addMatchers,
  },
  effects(store: Store) {
    const dispatch: Dispatch = store.getDispatch()

    return {
      async loadDash() {
        const dash = (await import('@zazuko/rdf-vocabularies/datasets/dash')).default
        const DashEditors = await import('../../DashEditors')

        dispatch.editors.addMetadata($rdf.dataset(dash($rdf)))
        dispatch.editors.addMatchers(DashEditors)
      },
      'forms/addObject': function ({ form, focusNode, property, key }: addObject.Params) {
        const { forms, editors } = store.getState()
        const propertyState = forms.instances.get(form)?.focusNodes[focusNode.value].properties.find(prop => prop.shape.equals(property))
        const objectState = propertyState?.objects.find(o => o.key === key)

        if (!propertyState || !objectState) return

        dispatch.forms.setSingleEditors({
          form,
          focusNode,
          propertyShape: propertyState.shape,
          editors: matchEditors(propertyState.shape, objectState.object, Object.values(editors.singleEditors).reduce<Editor<SingleEditor>[]>(toDefined, [])),
          object: key,
        })
      },
      'forms/updatePropertyObjects': function ({ form, focusNode, property }: updatePropertyObjects.Params) {
        const { editors } = store.getState()
        const singleEditors = Object.values(editors.singleEditors).reduce<Editor<SingleEditor>[]>(toDefined, [])
        const multiEditors = Object.values(editors.multiEditors).reduce<Editor<MultiEditor>[]>(toDefined, [])

        updatePropertyEditors({
          dispatch,
          form,
          focusNode,
          singleEditors,
          multiEditors,
        })(property)
      },
      'editors/addMatchers': () => {
        const { editors, forms } = store.getState()
        const singleEditors = Object.values(editors.singleEditors).reduce<Editor<SingleEditor>[]>(toDefined, [])
        const multiEditors = Object.values(editors.multiEditors).reduce<Editor<MultiEditor>[]>(toDefined, [])

        forms.instances.forEach((form, key) => {
          Object.values(form.focusNodes).forEach((focusNodeState) => {
            focusNodeState.properties.forEach(updatePropertyEditors({
              dispatch,
              form: key,
              focusNode: focusNodeState.focusNode,
              singleEditors,
              multiEditors,
            }))
          })
        })
      },
    }
  },
}))
