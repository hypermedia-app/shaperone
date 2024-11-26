/* eslint-disable no-continue */
import type { GraphPointer } from 'clownface'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { defaultValue } from '../../lib/objectValue.js'
import { notify } from '../../lib/notify.js'
import type { Store } from '../../../../state/index.js'
import type { Params } from '../../../forms/reducers/replaceFocusNodes.js'
import type { EditorsState } from '../../../editors/index.js'
import type { PropertyObjectState, PropertyState } from '../../../forms/index.js'
import type { FocusNode } from '../../../../index.js'

interface SetDefault {
  (params: {
    editors: EditorsState
    form: symbol
    property: PropertyState
    object: PropertyObjectState
    focusNode: FocusNode
    previousDefault: GraphPointer | undefined }): { shouldNotify: boolean; value?: GraphPointer }
}

interface SetNestedClass {
  (params: {
    object: PropertyObjectState
    property: PropertyState
  }): boolean
}

export default function createFocusNodeState(store: Store) {
  const dispatch = store.getDispatch()

  const setDefault: SetDefault = ({ editors, form, property, object, focusNode, previousDefault }) => {
    if (object.object) {
      return { shouldNotify: false }
    }
    const [value] = defaultValue({
      property: property.shape,
      focusNode,
      editor: object.selectedEditor,
      editorMeta: editors.metadata,
    })?.toArray() || []
    if (!value) {
      return { shouldNotify: false }
    }
    if (value.term.equals(previousDefault?.term)) {
      return { shouldNotify: false }
    }
    const predicate = property.shape.getPathProperty(true).id
    if (focusNode.has(predicate, value).terms.length) {
      return { shouldNotify: false }
    }

    focusNode.addOut(predicate, value)
    dispatch.forms.initObjectValue({
      form,
      focusNode,
      property: property.shape,
      object,
      value,
      editors,
    })

    return { shouldNotify: true, value }
  }

  const setNestedClass: SetNestedClass = ({ property: { shape }, object }) => {
    if (shape.class && object.object?.term.termType === 'BlankNode') {
      object.object.addOut(rdf.type, shape.class.id)

      return true
    }

    return false
  }

  return function ({ form, focusNode }: Pick<Params, 'form' | 'focusNode'>) {
    const { editors } = store.getState()

    for (const property of store.getState().forms.get(form)?.focusNodes[focusNode.value].properties || []) {
      let shouldNotify = false
      let previousDefault: GraphPointer | undefined
      for (const object of property.objects) {
        const result = setDefault({
          property, object, focusNode, editors, previousDefault, form,
        })

        previousDefault = result.value || previousDefault
        shouldNotify = shouldNotify || result.shouldNotify

        shouldNotify = shouldNotify || setNestedClass({ property, object })
      }

      if (shouldNotify) {
        notify({
          form,
          focusNode,
          property: property.shape,
          store,
        })
      }
    }
  }
}
