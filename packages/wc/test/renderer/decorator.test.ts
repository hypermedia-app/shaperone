import { html } from 'lit-html'
import { expect } from '@open-wc/testing'
import { sinon } from '@shaperone/testing'
import { css } from 'lit-element'
import { decorate } from '../../renderer/decorator'
import { FocusNodeTemplate } from '../../templates'

describe('@hydrofoil/shaperone-wc/components/decorator', () => {
  describe('.loadDependencies', () => {
    it('gets combined from base and extension', async () => {
      // given
      const base: FocusNodeTemplate = function () {
        return html``
      }
      base.loadDependencies = sinon.stub().returns([])
      const decoratedDeps = sinon.stub().returns([])

      // when
      const decorated = decorate((template: FocusNodeTemplate) => {
        const decorated: FocusNodeTemplate = (c, a) => template(c, a)

        decorated.loadDependencies = decoratedDeps

        return decorated
      })(base)
      await Promise.all(decorated.loadDependencies!())

      // then
      expect(base.loadDependencies).to.have.been.called
      expect(decoratedDeps).to.have.been.called
    })

    it('resues base dependencies', async () => {
      // given
      const base: FocusNodeTemplate = function () {
        return html``
      }
      base.loadDependencies = sinon.stub().returns([])

      // when
      const decorated = decorate((template: FocusNodeTemplate) => (c, a) => template(c, a))(base)
      await Promise.all(decorated.loadDependencies!())

      // then
      expect(base.loadDependencies).to.have.been.called
    })
  })

  describe('.styles', () => {
    it('get combined from base and extension', async () => {
      // given
      const base: FocusNodeTemplate = function () {
        return html``
      }
      base.styles = css`h1 { color: red }`

      // when
      const decorated = decorate((template: FocusNodeTemplate) => {
        const decorated: FocusNodeTemplate = (c, a) => template(c, a)

        decorated.styles = css`h2 { color: blue; }`

        return decorated
      })(base)
      const styles = css`${decorated.styles as any}`.toString()

      // then
      expect(styles).to.contain('h1')
      expect(styles).to.contain('h2')
    })

    it('reuses base styles if defined', async () => {
      // given
      const base: FocusNodeTemplate = function () {
        return html``
      }
      base.styles = css`h1 { color: red }`

      // when
      const decorated = decorate((template: FocusNodeTemplate) => (c, a) => template(c, a))(base)
      const styles = css`${decorated.styles as any}`.toString()

      // then
      expect(styles).to.contain('h1')
    })
  })
})
