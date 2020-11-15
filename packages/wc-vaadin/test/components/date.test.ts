import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { editorTestParams } from '@shaperone/testing'
import { dateTimePicker, datePicker } from '../../components/date'

describe('wc-vaadin/components/date', () => {
  describe('datePicker', () => {
    it('renders a vaadin-date-picker', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture(datePicker(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })

  describe('dateTimePicker', () => {
    it('renders a vaadin-date-time-picker', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture(dateTimePicker(params, actions))

      // then
      expect(element).to.equalSnapshot()
    })
  })
})
