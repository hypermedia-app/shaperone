import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import cf, { SingleContextClownface } from 'clownface'
import RdfResource from '@tpluscode/rdfine'
import * as Shacl from '@rdfine/shacl'
import { ShapeMixin } from '@rdfine/shacl/Shape'
import { sh, schema } from '@tpluscode/rdf-ns-builders'
import * as sinon from 'sinon'
import { initialize } from '../../state/reducers'
import { dash } from '../../index'
import { literal } from '@rdfjs/data-model'
import { EditorMatcher } from '../../lib/editorMatcher'

RdfResource.factory.addMixin(...Object.values(Shacl))

describe('@hydrofoil/shaperone/lib/shapeProcessor', () => {
  let shapePointer: SingleContextClownface
  let matcher: sinon.SinonStubbedInstance<EditorMatcher>

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
          name: literal('Name'),
        }],
      })
      matcher.matchValueEditor.returns([{
        editor: dash.TextFieldEditor,
        score: 1,
        label: 'text field',
      }])

      // when
      const definition = initialize({
        editors: {},
        matchers: [matcher],
        focusNodes: {},
      }, {
        shape,
        focusNode: cf({ dataset: $rdf.dataset(), term: $rdf.blankNode() }),
      })

      // then
      expect(definition.focusNodes.b1.properties).to.have.length(1)
      expect(definition.focusNodes.b1.groups).to.have.length(0)
    })
  })
})
