import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect, oneEvent } from '@open-wc/testing'
import type { SlButton } from '@shoelace-style/shoelace'
import { schema, rdf } from '@tpluscode/rdf-ns-builders'
import defineComponent from 'shaperone/test/defineComponent.js'
import { setEnv } from '@shaperone/core/env.js'
import { InstancesSelect } from '../../components.js'

describe('wc-shoelace/components/instancesSelect', function () {
  before(function () {
    setEnv($rdf)
  })

  beforeEach(defineComponent(InstancesSelect, { awaitEvent: 'sh1-ready' }))

  it('is disabled when dash:readOnly true', async function () {
    // given
    const params = editorTestParams({
      property: {
        readOnly: true,
      },
      object: $rdf.namedNode(''),
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
    graph.namedNode('john')
      .addOut(rdf.type, schema.Person)
      .addOut(schema.name, 'John Doe')
    const params = editorTestParams({
      graph,
      property: {
        class: schema.Person,
      },
      object: $rdf.namedNode('john'),
      labelProperties: [schema.name],
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-select',
    })

    // then
    expect(input.querySelector('sl-option')?.textContent!.trim()).to.eq('John Doe')
  })

  context('property $rdf.ns.sh1:clearable true', function () {
    it('makes select clearable', async function () {
      // given
      const params = editorTestParams({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: $rdf.namedNode(''),
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
      graph
        .namedNode('A')
        .addOut(rdf.type, schema.Person)
      const params = editorTestParams({
        graph,
        property: {
          class: schema.Person,
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: $rdf.namedNode('A'),
      })

      // when
      const { component, input } = await this.component.render(params, {
        element: 'sl-select',
      })
      setTimeout(() => input.renderRoot.querySelector<SlButton>('[part=clear-button]')!.click())

      // then
      const cleared = await oneEvent(component, 'cleared')
      expect(cleared).to.be.ok
    })
  })
})
