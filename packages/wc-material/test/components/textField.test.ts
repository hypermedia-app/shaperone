import { fixture, expect } from '@open-wc/testing'
import * as sinon from 'sinon'
import cf, { SingleContextClownface } from 'clownface'
import $rdf from '@rdfjs/dataset'
import type { EditorFactoryActions, EditorFactoryParams } from '@hydrofoil/shaperone-core/models/components'
import type { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { PropertyShape, PropertyShapeMixin } from '@rdfine/shacl'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { textField } from '../../components/textField'

interface TestParams {
  object: SingleContextClownface
  property?: Initializer<PropertyShape>
  datatype: typeof xsd.integer
}

describe('wc-material/components/textField', () => {
  function testParams({ object, property, datatype }: TestParams): { params: EditorFactoryParams; actions: EditorFactoryActions } {
    const value: PropertyObjectState = {
      editors: [],
      selectedEditor: undefined,
      object,
    }

    return {
      params: {
        property: {
          canAdd: true,
          canRemove: true,
          name: 'foo',
          objects: [value],
          compoundEditors: [],
          shape: new PropertyShapeMixin.Class(object.blankNode(), property),
          datatype,
        },
        value,
      },
      actions: {
        update: sinon.spy(),
        focusOnObjectNode: sinon.spy(),
      },
    }
  }

  describe('when datatype is numeric', () => {
    it('renders number input', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = testParams({
        object: graph.literal('1', xsd.int),
        datatype: xsd.int,
      })

      // when
      const element = await fixture(textField.render(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })
})
