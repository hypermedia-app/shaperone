import cf, { SingleContextClownface } from 'clownface'
import $rdf from '@rdfjs/dataset'
import { PropertyShape, PropertyShapeMixin } from '@rdfine/shacl'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { EditorFactoryActions, EditorFactoryParams } from '@hydrofoil/shaperone-core/models/components'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import * as sinon from 'sinon'
import { textField } from '../../components/text-field'

const datatytpes = [xsd.double, xsd.float, xsd.decimal, xsd.integer]

interface TestParams {
  object: SingleContextClownface
  property?: Initializer<PropertyShape>
  datatype?: typeof datatytpes[0]
}

describe('wc-vaadin/components/text-field', () => {
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

  datatytpes.forEach((datatype) => {
    it(`renders correct input for datatype ${datatype.value}`, async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = testParams({
        object: graph.literal(''),
        datatype,
      })

      // when
      const element = await fixture(textField.render(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })
})
