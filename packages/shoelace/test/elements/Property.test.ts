import { expect, fixture, html } from '@open-wc/testing'
import { testPropertyState } from '@shaperone/testing/models/form.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import Property from '../../elements/Property.js'

describe('wc-shoelace/elements/Property', function () {
  before(function () {
    customElements.define('sh1-property', Property)
  })

  it('renders an "add object" button', async function () {
    // given
    const property = testPropertyState({
      [sh.name.value]: 'Test Property',
    })

    // when
    const el = await fixture(html`<sh1-property .property="${property}"></sh1-property>`)

    // then
    await expect(el).shadowDom.to.equalSnapshot()
  })

  it('does not render an "add object" button when flag is not set', async function () {
    // given
    const property = testPropertyState({
      [sh.name.value]: 'Test Property',
    }, {
      canAdd: false,
    })

    // when
    const el = await fixture(html`<sh1-property .property="${property}"></sh1-property>`)

    // then
    await expect(el).shadowDom.to.equalSnapshot()
  })
})
