import { expect, fixture, html } from '@open-wc/testing'
import type{ ShSlProperty } from '../../elements/sh-sl-property'
import '../../elements/sh-sl-property.js'

describe('wc-shoelace/elements/sh-sl-property', () => {
  it('renders a slot for "add object" control', async () => {
    // given
    const canAddValue = true

    // when
    const el = await fixture<ShSlProperty>(html`<sh-sl-property .canAddValue="${canAddValue}"></sh-sl-property>`)

    // then
    expect(el).shadowDom.to.equalSnapshot()
  })

  it('does not render a slot for "add object" control when flag is not set', async () => {
    // when
    const el = await fixture<ShSlProperty>(html`<sh-sl-property></sh-sl-property>`)

    // then
    expect(el).shadowDom.to.equalSnapshot()
  })
})
