import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { Render } from '@hydrofoil/shaperone-wc'
import { editorTestParams } from '@shaperone/testing'
import { TextField } from '@material/mwc-textfield'
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
      const { params } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture<TextField>(render(params))

      // then
      expect(element.type).to.eq('date')
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
      const { params } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture<TextField>(render(params))

      // then
      expect(element.type).to.eq('datetime-local')
    })
  })
})
