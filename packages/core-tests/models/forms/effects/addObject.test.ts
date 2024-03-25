import { describe, it } from 'mocha'
import $rdf from '@zazuko/env/web.js'
import { expect } from 'chai'
import { sinon } from '@shaperone/testing'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { testStore } from '@shaperone/testing/models/form.js'
import { addObject } from '@hydrofoil/shaperone-core/models/forms/effects/addObject.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { SingleEditorMatch } from '@hydrofoil/shaperone-core/models/editors'
import { propertyShape } from '@shaperone/testing/util.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { blankNode } from '@shaperone/testing/nodeFactory.js'

describe('models/forms/effects/addObject', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('adds form field with matched editors', () => {
    // given
    const property = propertyShape()
    const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
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
      overrides: undefined,
    })

    // then
    const dispatch = store.getDispatch()
    const spy = dispatch.forms.addFormField as sinon.SinonSpy
    expect(spy.firstCall.firstArg).to.containSubset({
      form,
      property,
      focusNode,
      editors,
      selectedEditor: dash.TextFieldEditor,
    })
  })

  it('sets overrides to state', () => {
    // given
    const property = propertyShape()
    const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
    const editors: SingleEditorMatch[] = [{
      term: dash.TextFieldEditor,
      score: 5,
      meta: <any> {},
    }]
    store.getState().editors.matchSingleEditors = () => editors
    const overrides = blankNode().addOut(sh.nodeKind, sh.IRI)

    // when
    addObject(store)({
      form,
      property,
      focusNode,
      overrides,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.addFormField).to.have.been
      .calledWith(sinon.match(({ overrides }) => sh.IRI.equals(overrides.out(sh.nodeKind).term)))
  })

  it('takes property editor as default match', () => {
    // given
    const property = propertyShape({
      editor: dash.FooEditor,
    })
    const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
    store.getState().editors.matchSingleEditors = () => [{
      term: dash.TextFieldEditor,
      score: 5,
      meta: <any> {},
    }]

    // when
    addObject(store)({
      form,
      property,
      focusNode,
      overrides: undefined,
    })

    // then
    const dispatch = store.getDispatch()
    const spy = dispatch.forms.addFormField as sinon.SinonSpy
    expect(spy.firstCall.firstArg).to.containSubset({
      form,
      property,
      focusNode,
      selectedEditor: dash.FooEditor,
    })
  })

  context('with overrides', () => {
    it('sets selected editor', () => {
      // given
      const property = propertyShape({
        editor: dash.FooEditor,
      })
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      store.getState().editors.matchSingleEditors = () => [{
        term: dash.TextFieldEditor,
        score: 5,
        meta: <any> {},
      }]
      const overrides = blankNode().addOut(dash.editor, dash.BarEditor)

      // when
      addObject(store)({
        form,
        property,
        focusNode,
        overrides,
      })

      // then
      const dispatch = store.getDispatch()
      expect(dispatch.forms.addFormField).to.have.been.calledWith(sinon.match({
        selectedEditor: dash.BarEditor,
      }))
    })

    it('adds editor to array', () => {
      // given
      const property = propertyShape({
        editor: dash.FooEditor,
      })
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      store.getState().editors.matchSingleEditors = () => [{
        term: dash.TextFieldEditor,
        score: 5,
        meta: <any> {},
      }]
      const overrides = blankNode().addOut(dash.editor, dash.BarEditor)

      // when
      addObject(store)({
        form,
        property,
        focusNode,
        overrides,
      })

      // then
      const dispatch = store.getDispatch()
      expect(dispatch.forms.addFormField).to.have.been.calledWith(sinon.match({
        editors: sinon.match.some(sinon.match({
          term: dash.BarEditor,
          score: null,
        })),
      }))
    })

    it('does not add extra editor to array if its already a match and move match to the top', () => {
      // given
      const property = propertyShape({
        editor: dash.FooEditor,
      })
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      store.getState().editors.matchSingleEditors = () => [{
        term: dash.TextFieldEditor,
        score: 5,
        meta: <any> {},
      }, {
        term: dash.BarEditor,
        score: 1,
        meta: <any> {},
      }]
      const overrides = blankNode().addOut(dash.editor, dash.BarEditor)

      // when
      addObject(store)({
        form,
        property,
        focusNode,
        overrides,
      })

      // then
      const dispatch = store.getDispatch()
      expect(dispatch.forms.addFormField).to.have.been.calledWith(sinon.match({
        editors: sinon.match.has('length', 3)
          .and(sinon.match(([first]: [SingleEditorMatch]) => first.term.equals(dash.BarEditor) && first.score === null)),
      }))
    })
  })
})
