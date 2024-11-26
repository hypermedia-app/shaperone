import { fixture, expect } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import { xsd } from '@tpluscode/rdf-ns-builders'
import type { Render } from '@hydrofoil/shaperone-wc'
import { editorTestParams } from '@shaperone/testing'
import type { TextField } from '@material/mwc-textfield'
import { textField } from '../../components.js'

describe('wc-material/components/textField', () => {
  let render: Render

  before(async () => {
    render = await textField.lazyRender()
  })

  describe('when datatype is numeric', () => {
    it('renders number input', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal('1', xsd.int),
        datatype: xsd.int,
      })

      // when
      const element = await fixture<TextField>(render(params, actions))

      // then
      expect(element.type).to.equal('number')
    })
  })
})
