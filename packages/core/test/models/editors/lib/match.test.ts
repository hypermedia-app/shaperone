import { describe, it } from 'mocha'
import { PropertyShape } from '@rdfine/shacl'
import { dash } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import { expect } from 'chai'
import { testStore } from '../../forms/util'
import { Editor, EditorsState, SingleEditor, MultiEditor } from '../../../../models/editors'
import { matchSingleEditors, matchMultiEditors } from '../../../../models/editors/lib/match'

describe('models/editors/lib/match', () => {
  let editors: EditorsState
  let shape: PropertyShape

  beforeEach(() => {
    ({ editors } = testStore().store.getState())
  })

  describe('matchSingleEditors', () => {
    function singleEditors(...values: [NamedNode, Editor<SingleEditor>['match']][]): void {
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
  })

  describe('matchMultiEditors', () => {
    function multiEditors(...values: [NamedNode, Editor<MultiEditor>['match']][]): void {
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
