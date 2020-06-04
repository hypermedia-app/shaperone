import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import RdfResource from '@tpluscode/rdfine'
import * as Shacl from '@rdfine/shacl'
import { ShapeMixin } from '@rdfine/shacl/Shape'
import { sh, schema, skos } from '@tpluscode/rdf-ns-builders'
import * as sinon from 'sinon'
import ns from '@rdfjs/namespace'
import { processShape } from '../../lib/shapeProcessor'
import { dash } from '../../index'

RdfResource.factory.addMixin(...Object.values(Shacl))

const ex = ns('http://example.com/')

describe('@hydrofoil/shaperone/lib/shapeProcessor', () => {
  let shapePointer
  let matcher

  beforeEach(() => {
    shapePointer = cf({ dataset: $rdf.dataset(), term: $rdf.blankNode() }).addOut(sh.NodeShape)
    matcher = {
      matchCompoundEditor: sinon.stub(),
      matchValueEditor: sinon.stub(),
    }
  })

  describe('processShape', () => {
    it('groups properties without group', () => {
      // given
      const shape = new ShapeMixin.Class(shapePointer, {
        property: [{
          path: schema.name,
          name: 'Name',
        }],
      })
      matcher.matchValueEditor.returns([{
        editor: dash.TextFieldEditor,
        score: 1,
      }])

      // when
      const definition = processShape(shape, matcher)
      const [ungroupedProperties] = definition.groups

      // then
      expect(ungroupedProperties.group).to.be.undefined
      expect(ungroupedProperties.properties).to.have.length(1)
    })

    it('groups properties by group', () => {
      // given
      const shape = new ShapeMixin.Class(shapePointer, {
        property: [{
          types: [sh.PropertyShape],
          path: skos.prefLabel,
          name: 'Label',
          group: ex.First,
        }, {
          types: [sh.PropertyShape],
          path: skos.altLabel,
          name: 'Alternative label',
          group: ex.Second,
        }],
      })
      matcher.matchValueEditor.returns([{
        editor: dash.TextFieldEditor,
        score: 1,
      }])

      // when
      const definition = processShape(shape, matcher)
      const [first, second] = definition.groups

      // then
      expect(first.group.id.equals(ex.First)).to.be.true
      expect(second.group.id.equals(ex.Second)).to.be.true
      expect(first.properties).to.have.length(1)
      expect(second.properties).to.have.length(1)
    })
  })
})
