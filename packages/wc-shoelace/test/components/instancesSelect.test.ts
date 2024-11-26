import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture, nextFrame } from '@open-wc/testing'
import type { SlButton, SlSelect } from '@shoelace-style/shoelace'
import type { InstancesSelect } from '@hydrofoil/shaperone-core/lib/components/instancesSelect.js'
import { schema } from '@tpluscode/rdf-ns-builders'
import { instancesSelect } from '../../components/instancesSelect.js'

describe('wc-shoelace/components/instancesSelect', () => {
  let component: InstancesSelect

  beforeEach(async () => {
    component = {
      ...instancesSelect,
      render: await instancesSelect.lazyRender(),
    }
  })

  it('is disabled when dash:readOnly true', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      property: {
        readOnly: true,
      },
      object: graph.namedNode(''),
    })

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    expect(result.disabled).to.be.true
  })

  it('uses form settings for display labels', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const {
      params,
      actions,
    } = editorTestParams<InstancesSelect>({
      componentState: {
        instances: [
          graph.namedNode('A').addOut(schema.name, 'Ą'),
        ],
      },
      object: graph.namedNode('A'),
    })
    params.form.labelProperties = [schema.name]

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    expect(result.querySelector('sl-option')?.textContent).to.eq('Ą')
  })

  context('property $rdf.ns.sh1:clearable true', () => {
    it('makes select clearable', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<InstancesSelect>({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const result = await fixture<SlSelect>(component.render(params, actions))

      // then
      expect(result.clearable).to.be.true
    })

    it('clears value when cleared', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<InstancesSelect>({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: graph.namedNode('A'),
        componentState: {
          instances: [
            graph.namedNode('A'),
            graph.namedNode('B'),
            graph.namedNode('C'),
          ],
        },
      })

      // when
      const result = await fixture<SlSelect>(component.render(params, actions))
      result.renderRoot.querySelector<SlButton>('[part=clear-button]')!.click()

      // then
      await nextFrame()
      expect(actions.clear).to.have.been.called
    })
  })
})
