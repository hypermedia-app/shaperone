import { fixture, expect } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { textField } from '../../components/textField'
import { editorTestParams } from '../util'

describe('wc-material/components/textField', () => {
  describe('when datatype is numeric', () => {
    it('renders number input', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
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
