import { css, html } from 'lit'
import { expect } from '@open-wc/testing'
import { renderer } from '../../renderer/model.js'
import { templates } from '../../templates.js'

describe('wc/renderer/model', () => {
  describe('reducers', () => {
    describe('setTemplates', () => {
      it('deep merges new templates with old', () => {
        // given
        const before = {
          templates,
          styles: [css``],
        }

        // when
        const loading = () => html`Please wait`
        const after = renderer.reducers.setTemplates(before, {
          component: {
            loading,
          },
        })

        // then
        expect(after.templates.form).to.eq(templates.form)
        expect(after.templates.component.initializing).to.eq(templates.component.initializing)
        expect(after.templates.component.loading).to.eq(loading)
      })
    })
  })
})
