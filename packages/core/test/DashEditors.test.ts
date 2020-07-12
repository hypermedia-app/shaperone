import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { dash, sh, xsd } from '@tpluscode/rdf-ns-builders'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { expect } from 'chai'
import * as DashEditors from '../DashEditors'

describe('core/DashEditors', () => {
  describe(dash.TextFieldEditor.value, () => {
    it('has score 10 for string numeric datatype', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode())
      const value = graph.literal(3)

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(10)
    })

    it('has score 0 for string boolean datatype', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode())
      const value = graph.literal(true)

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 0 for string with language tag', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode())
      const value = graph.literal('foo', 'en')

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 0 when there is no datatype and value is not literal', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode())
      const value = graph.blankNode()

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(0)
    })
  })

  describe(dash.TextAreaEditor.value, () => {
    it('has score 0 for non-string datatype', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode())
      const value = graph.literal(3)

      // when
      const result = DashEditors.textArea.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 2 when field has datatype xsd:string', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode(), {
        [sh.datatype.value]: xsd.string,
      })
      const value = graph.literal(3)

      // when
      const result = DashEditors.textArea.match(property, value)

      // then
      expect(result).to.eq(2)
    })

    it('has score 5 when value is a string', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(graph.blankNode(), {
        [sh.datatype.value]: xsd.string,
      })
      const value = graph.literal('3', 'en')

      // when
      const result = DashEditors.textArea.match(property, value)

      // then
      expect(result).to.eq(2)
    })
  })

  describe(dash.EnumSelectEditor.value, () => {
    it('has score 10 when sh:in exists for property shape', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = new PropertyShapeMixin.Class(
        graph.blankNode().addList(sh.in, ['DE', 'EN']),
      )
      const value = graph.literal(3)

      // when
      const result = DashEditors.enumSelect.match(property, value)

      // then
      expect(result).to.eq(10)
    })
  })
})
