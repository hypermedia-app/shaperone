import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { dash } from '@tpluscode/rdf-ns-builders'
import { addObject } from '../../../../models/forms/effects/addObject'
import { Store } from '../../../../state'
import { testStore } from '../util'
import { propertyShape } from '../../../util'
import { SingleEditorMatch } from '../../../../models/editors'

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
      match: () => 5,
      score: 5,
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
