import { describe, it } from 'mocha'
import type { PropertyShape } from '@rdfine/shacl'
import { schema } from '@tpluscode/rdf-ns-builders'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import type { NamedNode } from '@rdfjs/types'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form.js'
import type { Editor, EditorsState, MultiEditor } from '@hydrofoil/shaperone-core/models/editors'
import { matchSingleEditors, matchMultiEditors } from '@hydrofoil/shaperone-core/models/editors/lib/match.js'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/editors/lib/match', () => {
  let editors: EditorsState
  let shape: PropertyShape

  beforeEach(() => {
    ({ editors } = testStore().store.getState())
    shape = propertyShape()
  })

  describe('matchSingleEditors', () => {
    function singleEditors(...values: [NamedNode, Editor['match']][]): void {
      editors.singleEditors = values.reduce((map, [term, match]) => ({
        ...map,
        [term.value]: {
          term,
          match,
          meta: {} as any,
        },
      }), {})
    }

    it('sorts results by score', () => {
      // given
      singleEditors(
        [dash.TextFieldEditor, () => 10],
        [dash.TextAreaEditor, () => 20],
        [dash.EnumSelectEditor, () => 1],
      )

      // when
      const matches = matchSingleEditors.call(editors, { shape })

      // then
      expect(matches.map(m => m.term)).to.deep.contain.ordered.members([
        dash.TextAreaEditor,
        dash.TextFieldEditor,
        dash.EnumSelectEditor,
      ])
    })

    it('excludes score = 0', () => {
      // given
      singleEditors(
        [dash.TextFieldEditor, () => 0],
        [dash.TextAreaEditor, () => 0],
        [dash.EnumSelectEditor, () => 0],
      )

      // when
      const matches = matchSingleEditors.call(editors, { shape })

      // then
      expect(matches).to.have.length(0)
    })

    it('keeps score = null last', () => {
      // given
      singleEditors(
        [dash.TextFieldEditor, () => 10],
        [dash.TextAreaEditor, () => 20],
        [dash.EnumSelectEditor, () => null],
      )

      // when
      const matches = matchSingleEditors.call(editors, { shape })

      // then
      expect(matches[2].term).to.deep.eq(dash.EnumSelectEditor)
    })

    it('matches blank nodes when property has sh:class', () => {
      // given
      shape.class = schema.Person as any
      singleEditors(
        [dash.TextFieldEditor, (prop, node) => (node.term.termType === 'BlankNode' ? 0 : 10)],
        [dash.DetailsEditor, (prop, node) => (node.term.termType === 'BlankNode' ? 10 : 0)],
      )

      // when
      const matches = matchSingleEditors.call(editors, { shape })

      // then
      expect(matches).to.have.length(1)
      expect(matches[0].term).to.deep.eq(dash.DetailsEditor)
    })

    it('includes dash:editor with score 100 in the result', () => {
      // given
      shape.editor = dash.FooEditor as any
      singleEditors(
        [dash.TextFieldEditor, () => 10],
      )

      // when
      const matches = matchSingleEditors.call(editors, { shape })

      // expect
      expect(matches).to.have.length(2)
      expect(matches[0]).to.deep.contain({
        term: dash.FooEditor,
        score: 100,
      })
    })

    it('sets preferred editor score to 100 if it is otherwise found by matching', () => {
      // given
      shape.editor = dash.TextFieldEditor as any
      singleEditors(
        [dash.TextFieldEditor, () => 10],
      )

      // when
      const matches = matchSingleEditors.call(editors, { shape })

      // expect
      expect(matches).to.have.length(1)
      expect(matches[0]).to.deep.contain({
        term: dash.TextFieldEditor,
        score: 100,
      })
    })
  })

  describe('matchMultiEditors', () => {
    function multiEditors(...values: [NamedNode, MultiEditor['match']][]): void {
      editors.multiEditors = values.reduce((map, [term, match]) => ({
        ...map,
        [term.value]: {
          term,
          match,
          meta: {} as any,
        },
      }), {})
    }

    it('sorts results by score', () => {
      // given
      multiEditors(
        [dash.TextFieldEditor, () => 10],
        [dash.TextAreaEditor, () => 20],
        [dash.EnumSelectEditor, () => 1],
      )

      // when
      const matches = matchMultiEditors.call(editors, { shape })

      // then
      expect(matches.map(m => m.term)).to.deep.contain.ordered.members([
        dash.TextAreaEditor,
        dash.TextFieldEditor,
        dash.EnumSelectEditor,
      ])
    })

    it('excludes score = 0', () => {
      // given
      multiEditors(
        [dash.TextFieldEditor, () => 0],
        [dash.TextAreaEditor, () => 0],
        [dash.EnumSelectEditor, () => 0],
      )

      // when
      const matches = matchMultiEditors.call(editors, { shape })

      // then
      expect(matches).to.have.length(0)
    })

    it('keeps score = null last', () => {
      // given
      multiEditors(
        [dash.TextFieldEditor, () => 10],
        [dash.TextAreaEditor, () => 20],
        [dash.EnumSelectEditor, () => null],
      )

      // when
      const matches = matchMultiEditors.call(editors, { shape })

      // then
      expect(matches[2].term).to.deep.eq(dash.EnumSelectEditor)
    })
  })
})
