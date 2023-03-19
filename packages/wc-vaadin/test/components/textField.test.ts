import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { editorTestParams } from '@shaperone/testing'
import { textField } from '../../components/text-field'

const datatytpes = [xsd.double, xsd.float, xsd.decimal, xsd.integer]

describe('wc-vaadin/components/text-field', () => {
  datatytpes.forEach((datatype) => {
    it(`renders correct input for datatype ${datatype.value}`, async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype,
      })

      // when
      const element = await fixture(textField(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })
})
