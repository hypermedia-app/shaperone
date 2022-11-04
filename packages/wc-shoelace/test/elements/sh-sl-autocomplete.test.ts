import { html, expect, fixture } from '@open-wc/testing'
import '../../elements/sh-sl-autocomplete.js'
import type { ShSlAutocomplete } from '../../elements/sh-sl-autocomplete'

describe('wc-shoelace/elements/sh-sl-autocomplete', () => {
  it('has empty property when empty', async () => {
    // when
    const el = await fixture<ShSlAutocomplete>(html`<sh-sl-autocomplete></sh-sl-autocomplete>`)

    // then
    expect(el.empty).to.be.true
  })

  it('hides menu when empty', async () => {
    // when
    const el = await fixture<ShSlAutocomplete>(html`<sh-sl-autocomplete></sh-sl-autocomplete>`)

    // then
    expect(el.renderRoot.querySelector('sl-menu')).attr('hidden').to.eq('')
  })

  it('disables dropdown when readonly', async () => {
    // when
    const el = await fixture<ShSlAutocomplete>(html`<sh-sl-autocomplete readonly></sh-sl-autocomplete>`)

    // expect
    expect(el.renderRoot.querySelector('sl-dropdown')?.disabled).to.be.true
  })

  it('spins the icon when [loading]', async () => {
    // when
    const el = await fixture<ShSlAutocomplete>(html`<sh-sl-autocomplete loading></sh-sl-autocomplete>`)

    // expect
    expect(el.renderRoot.querySelector('sl-input sl-icon')).to.have.style('animation-name', 'spin')
  })
})
