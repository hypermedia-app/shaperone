import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect, oneEvent } from '@open-wc/testing'
import { rdfs, schema } from '@tpluscode/rdf-ns-builders'
import defineComponent from '@hydrofoil/shaperone-wc/test/defineComponent.js'
import { setEnv } from '@hydrofoil/shaperone-core/env.js'
import type { EnumSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import { EnumSelect } from '../../components.js'

describe('wc-shoelace/components/enumSelect', function () {
  before(function () {
    setEnv($rdf)
  })

  beforeEach(defineComponent(EnumSelect, { awaitEvent: 'sh1-ready' }))

  it('is disabled when dash:readOnly true', async function () {
    // given
    const graph = $rdf.clownface()
    const params = editorTestParams({
      property: {
        readOnly: true,
      },
      object: graph.literal(''),
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-select',
    })

    // then
    expect(input.disabled).to.be.true
  })

  it('uses form settings for display labels', async function () {
    // given
    const graph = $rdf.clownface()
    const params = editorTestParams<EnumSelectEditor>({
      property: {
        in: [{
          id: 'A',
          [schema.name.value]: 'Ą',
        }],
      },
      object: graph.namedNode('A'),
      labelProperties: [schema.name],
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-select',
    })

    // then
    expect(input.querySelector('sl-option')?.textContent!.trim()).to.eq('Ą')
  })

  it('uses rdfs:label by default', async function () {
    // given
    const graph = $rdf.clownface()
    const params = editorTestParams<EnumSelectEditor>({
      property: {
        in: [{
          id: 'http://lexvo.org/id/iso639-1/en',
          [rdfs.label.value]: 'English',
        }],
      },
      object: graph.namedNode('http://lexvo.org/id/iso639-1/en'),
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-select',
    })

    // then
    expect(input.querySelector('sl-option')?.textContent!.trim()).to.eq('English')
  })

  context('property $rdf.ns.sh1:clearable true', function () {
    it('makes select clearable', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        property: {
          readOnly: true,
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: graph.literal(''),
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-select',
      })

      // then
      expect(input.clearable).to.be.true
    })

    it('clears value when cleared', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
          in: [
            $rdf.literal('A'),
            $rdf.literal('B'),
            $rdf.literal('C'),
          ],
        },
        object: graph.literal('B'),
      })

      // when
      const { component, input } = await this.component.render(params, {
        element: 'sl-select',
      })
      setTimeout(() => {
        input.renderRoot.querySelector<HTMLButtonElement>('.select__clear')?.click()
      })

      const cleared = await oneEvent(component, 'cleared')

      // then
      expect(cleared).to.be.ok
    })
  })
})
