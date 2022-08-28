import { html, expect, fixture } from '@open-wc/testing'
import '../../elements/sh-sl-autocomplete.js'
import type { ShSlAutocomplete } from '../../elements/sh-sl-autocomplete'

describe('packages/wc-shoelace/elements/sh-sl-autocomplete', () => {
  it('has empty property when empty', async () => {
    // when
    const el = await fixture<ShSlAutocomplete>(html`<sh-sl-autocomplete></sh-sl-autocomplete>`)

    // then
    expect(el.empty).to.be.true
  })

  it('has empty attribute when empty', async () => {
    // when
    const el = await fixture<ShSlAutocomplete>(html`<sh-sl-autocomplete></sh-sl-autocomplete>`)

    // then
    expect(el).attr('empty').to.eq('')
  })
})