import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { sinon } from '@shaperone/testing'
import { dash } from '@tpluscode/rdf-ns-builders'
import { testStore } from '@shaperone/testing/models/form.js'
import { addObject } from '@hydrofoil/shaperone-core/models/forms/effects/addObject.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { SingleEditorMatch } from '@hydrofoil/shaperone-core/models/editors'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/addObject', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('adds form field with matched editors', () => {
    // given
    const property = propertyShape()
    const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
    const editors: SingleEditorMatch[] = [{
      term: dash.TextFieldEditor,
      score: 5,
      meta: <any> {},
    }]
    store.getState().editors.matchSingleEditors = () => editors

    // when
    addObject(store)({
      form,
      property,
      focusNode,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.addFormField).to.have.been.calledWith(sinon.match({
      form,
      property,
      focusNode,
      editors,
    }))
  })
})
