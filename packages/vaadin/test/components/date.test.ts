import $rdf from '@zazuko/env/web.js'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { editorTestParams } from '@shaperone/testing'
import { dateTimePicker, datePicker } from '../../components/date.js'

describe('wc-vaadin/components/date', function () {
  describe('datePicker', function () {
    it('renders a vaadin-date-picker', async function () {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture(datePicker(params, actions))

      // then
      await expect(element).to.equalSnapshot()
    })
  })

  describe('dateTimePicker', function () {
    it('renders a vaadin-date-time-picker', async function () {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })

      // when
      const element = await fixture(dateTimePicker(params, actions))

      // then
      await expect(element).to.equalSnapshot()
    })
  })
})
