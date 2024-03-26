import $rdf from '@shaperone/testing/env.js'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { editorTestParams } from '@shaperone/testing'
import { shrink } from '@zazuko/prefixes'
import { textField } from '../../components/text-field.js'

const datatytpes = [xsd.double, xsd.float, xsd.decimal, xsd.integer]

describe('wc-vaadin/components/text-field', () => {
  datatytpes.forEach((datatype) => {
    it(`renders correct input for datatype ${shrink(datatype.value)}`, async () => {
      // given
      const graph = $rdf.clownface()
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype,
      })

      // when
      const element = await fixture(textField(params, actions))

      // then
      await expect(element).to.equalSnapshot()
    })
  })
})
