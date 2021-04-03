import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { dash } from '@tpluscode/rdf-ns-builders'
import { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form'
import { selectEditor } from '../../../../models/forms/reducers/selectEditor'
import { Store } from '../../../../state'
import { FocusNode } from '../../../../index'
import { FormState } from '../../../../models/forms'
import { propertyShape } from '../../../util'

describe('core/models/forms/reducers/selectEditor', () => {
  let store: Store
  let form: symbol
  let focusNode: FocusNode
  let formState: {
    focusNodes: RecursivePartial<FormState['focusNodes']>
    focusStack: FormState['focusStack']
  }

  beforeEach(() => {
    ({ form, store } = testStore())
    focusNode = clownface({ dataset: $rdf.dataset() }).blankNode('baz')
    formState = store.getState().forms.get(form)!
  })

  it('updates object state', () => {
    // given
    const property = propertyShape()
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        objects: [{
          key: 'test',
        }],
      }],
    }

    // when
    const afterState = selectEditor(store.getState().forms, {
      form,
      property,
      editor: dash.TextFieldEditor,
      focusNode,
      object: {
        key: 'test',
        editors: [],
        selectedEditor: undefined,
        componentState: {},
        validationResults: [],
        hasErrors: false,
      },
    })

    // then
    expect(afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects[0].selectedEditor)
      .to.deep.eq(dash.TextFieldEditor)
  })

  it('resets component state', () => {
    // given
    const property = propertyShape()
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        objects: [{
          key: 'test',
        }],
      }],
    }

    // when
    const afterState = selectEditor(store.getState().forms, {
      form,
      property,
      editor: dash.TextFieldEditor,
      focusNode,
      object: {
        key: 'test',
        editors: [],
        selectedEditor: undefined,
        componentState: { foo: 'bar' },
        validationResults: [],
        hasErrors: false,
      },
    })

    // then
    expect(afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects[0].componentState).to.deep.eq({})
  })
})
