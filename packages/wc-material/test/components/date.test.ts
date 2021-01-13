import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { Render } from '@hydrofoil/shaperone-wc'
import { editorTestParams } from '@shaperone/testing'
import { dateTimePicker, datePicker } from '../../components'

describe('wc-material/components/date', () => {
  describe('datePicker', () => {
    let render: Render

    before(async () => {
      render = await datePicker.lazyRender()
    })

    it('renders a mwc-textfield[type=date]', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture(render(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })

  describe('dateTimePicker', () => {
    let render: Render

    before(async () => {
      render = await dateTimePicker.lazyRender()
    })

    it('renders a mwc-textfield[type=datetime-local]', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture(render(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })
})
