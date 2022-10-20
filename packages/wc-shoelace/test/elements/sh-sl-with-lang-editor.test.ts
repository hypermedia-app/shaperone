import { expect, fixture, html } from '@open-wc/testing'
import type { ShSlWithLangEditor } from '../../elements/sh-sl-with-lang-editor'
import '../../elements/sh-sl-with-lang-editor.js'

describe('wc-shoelace/elements/sh-sl-with-lang-editor', () => {
  context('when readonly', () => {
    context('given language choices', () => {
      it('disables select when readonly', async () => {
        // given
        const languages = ['en', 'de', 'pl']

        // when
        const el = await fixture<ShSlWithLangEditor>(html`<sh-sl-with-lang-editor readonly .languages="${languages}"></sh-sl-with-lang-editor>`)

        // expect
        expect(el.renderRoot.querySelector('sl-select')?.disabled).to.be.true
      })
    })

    context('without language choices', () => {
      it('disables input when readonly', async () => {
        // when
        const el = await fixture<ShSlWithLangEditor>(html`<sh-sl-with-lang-editor readonly></sh-sl-with-lang-editor>`)

        // expect
        expect(el.renderRoot.querySelector('sl-input')?.readonly).to.be.true
      })
    })
  })
})
