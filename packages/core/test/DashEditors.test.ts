import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { dash, rdf, schema, sh, xsd } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import * as DashEditors from '../DashEditors'
import { propertyShape } from './util'

describe('core/DashEditors', () => {
  describe(dash.TextFieldEditor.value, () => {
    it('has score 10 for string numeric datatype', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.literal(3)

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(10)
    })

    it('has score 0 for string boolean datatype', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.literal(true)

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 0 for string with language tag', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.literal('foo', 'en')

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 0 when there is no datatype and value is not literal', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.blankNode()

      // when
      const result = DashEditors.textField.match(property, value)

      // then
      expect(result).to.eq(0)
    })
  })

  describe(dash.TextFieldWithLangEditor.value, () => {
    it('has score 10 for langString value', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const value = graph.literal('test', 'en')

      // when
      const result = DashEditors.textFieldWithLang.match(property, value)

      // then
      expect(result).to.eq(10)
    })

    it('has score 5 when datatype is langString', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape({
        [sh.datatype.value]: rdf.langString,
      })
      const value = graph.blankNode()

      // when
      const result = DashEditors.textFieldWithLang.match(property, value)

      // then
      expect(result).to.eq(5)
    })

    it('has score 5 when datatype is string', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape({
        [sh.datatype.value]: xsd.string,
      })
      const value = graph.blankNode()

      // when
      const result = DashEditors.textFieldWithLang.match(property, value)

      // then
      expect(result).to.eq(5)
    })

    it('has score 0 when singleLine is false', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape({
        [sh.datatype.value]: rdf.langString,
        [dash.singleLine.value]: false,
      })
      const value = graph.blankNode()

      // when
      const result = DashEditors.textFieldWithLang.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 0 otherwise', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const value = graph.blankNode()

      // when
      const result = DashEditors.textFieldWithLang.match(property, value)

      // then
      expect(result).to.eq(0)
    })
  })

  describe(dash.TextAreaEditor.value, () => {
    it('has score 0 for non-string datatype', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.literal(3)

      // when
      const result = DashEditors.textArea.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 2 when field has datatype xsd:string', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
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
      const property = propertyShape(graph.blankNode(), {
        [sh.datatype.value]: xsd.string,
      })
      const value = graph.literal('3', 'en')

      // when
      const result = DashEditors.textArea.match(property, value)

      // then
      expect(result).to.eq(2)
    })
  })

  describe(dash.TextAreaWithLangEditor.value, () => {
    it('has score 0 when singleLine is true', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape({
        [dash.singleLine.value]: true,
      })
      const value = graph.literal(3)

      // when
      const result = DashEditors.textAreaWithLang.match(property, value)

      // then
      expect(result).to.eq(0)
    })

    it('has score 15 when value has type langString and singleLine is false', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape({
        [dash.singleLine.value]: false,
      })
      const value = graph.literal('test', 'fr')

      // when
      const result = DashEditors.textAreaWithLang.match(property, value)

      // then
      expect(result).to.eq(15)
    })

    it('has score 5 when value is a langString', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const value = graph.literal('test', 'en')

      // when
      const result = DashEditors.textAreaWithLang.match(property, value)

      // then
      expect(result).to.eq(5)
    })

    it('has score 5 when datatype is langString', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape({
        [sh.datatype.value]: rdf.langString,
      })
      const value = graph.blankNode()

      // when
      const result = DashEditors.textAreaWithLang.match(property, value)

      // then
      expect(result).to.eq(5)
    })

    it('has score 0 otherwise', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const value = graph.blankNode()

      // when
      const result = DashEditors.textAreaWithLang.match(property, value)

      // then
      expect(result).to.eq(0)
    })
  })

  describe(dash.EnumSelectEditor.value, () => {
    it('has score 20 when sh:in exists for property shape and non-empty value is part of the set', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(
        graph.blankNode().addList(sh.in, ['DE', 'EN']),
      )
      const value = graph.literal('EN')

      // when
      const result = DashEditors.enumSelect.match(property, value)

      // then
      expect(result).to.eq(20)
    })

    it('has score 20 when sh:in exists and value is empty string', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(
        graph.blankNode().addList(sh.in, ['DE', 'EN']),
      )
      const value = graph.literal('')

      // when
      const result = DashEditors.enumSelect.match(property, value)

      // then
      expect(result).to.eq(20)
    })

    it('has score 6 when sh:in exists but value is not in the set', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(
        graph.blankNode().addList(sh.in, ['DE', 'EN']),
      )
      const value = graph.literal('FR')

      // when
      const result = DashEditors.enumSelect.match(property, value)

      // then
      expect(result).to.eq(6)
    })
  })

  describe(dash.DatePickerEditor.value, () => {
    it('should have score 15 if value is xsd:date', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.literal('2000-10-09', xsd.date)

      // when
      const result = DashEditors.datePicker.match(property, value)

      // then
      expect(result).to.eq(15)
    })

    it('should have score 5 if shape has datatype xsd:date', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        [sh.datatype.value]: xsd.date,
      })
      const value = graph.literal('')

      // when
      const result = DashEditors.datePicker.match(property, value)

      // then
      expect(result).to.eq(5)
    })
  })

  describe(dash.DateTimePickerEditor.value, () => {
    it('should have score 15 if value is xsd:dateTime', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())
      const value = graph.literal('2000-10-09', xsd.dateTime)

      // when
      const result = DashEditors.dateTimePicker.match(property, value)

      // then
      expect(result).to.eq(15)
    })

    it('should have score 5 if shape has datatype xsd:dateTime', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        [sh.datatype.value]: xsd.dateTime,
      })
      const value = graph.literal('')

      // when
      const result = DashEditors.dateTimePicker.match(property, value)

      // then
      expect(result).to.eq(5)
    })
  })

  describe(dash.InstancesSelectEditor.value, () => {
    it('should have score 0 if property does not have sh:class', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())

      // when
      const result = DashEditors.instancesSelectEditor.match(property, graph.blankNode())

      // then
      expect(result).to.eq(0)
    })

    it('should have score null if property has sh:class', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        class: schema.Person,
      })

      // when
      const result = DashEditors.instancesSelectEditor.match(property, graph.blankNode())

      // then
      expect(result).to.eq(null)
    })
  })

  describe(dash.URIEditor.value, () => {
    it('should have score 10 if the value is a IRI node and the property has sh:nodeKind sh:IRI', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind: sh.IRI,
      })

      // when
      const result = DashEditors.uriEditor.match(property, graph.namedNode('foo'))

      // then
      expect(result).to.eq(10)
    })

    it('should have score 0 if the property has sh:class constraint', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind: sh.IRI,
        class: schema.Person,
      })

      // when
      const result = DashEditors.uriEditor.match(property, graph.namedNode('foo'))

      // then
      expect(result).to.eq(0)
    })

    it('should have score null if the value is IRI', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())

      // when
      const result = DashEditors.uriEditor.match(property, graph.namedNode('foo'))

      // then
      expect(result).to.eq(null)
    })

    it('should have score 0 if the value is not IRI', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode())

      // when
      const result = DashEditors.uriEditor.match(property, graph.blankNode() as any)

      // then
      expect(result).to.eq(0)
    })
  })
})
