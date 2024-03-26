import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import { dash } from '@tpluscode/rdf-ns-builders'
import { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { selectEditor } from '@hydrofoil/shaperone-core/models/forms/reducers/selectEditor.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FocusNode } from '@hydrofoil/shaperone-core/index.js'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { propertyShape } from '@shaperone/testing/util.js'

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
    focusNode = $rdf.clownface().blankNode('baz')
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
        nodeKind: undefined,
        overrides: undefined,
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
        nodeKind: undefined,
        overrides: undefined,
      },
    })

    // then
    expect(afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects[0].componentState).to.deep.eq({})
  })
})
