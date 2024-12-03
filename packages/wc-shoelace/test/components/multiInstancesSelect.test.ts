import type { MultiEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import { expect, fixture, nextFrame } from '@open-wc/testing'
import type { SlButton, SlSelect } from '@shoelace-style/shoelace'
import $rdf from '@shaperone/testing/env.js'
import { editorTestParams, sinon } from '@shaperone/testing'
import { schema } from '@tpluscode/rdf-ns-builders'
import type { InstancesMultiSelect } from '../../component-extras.js'
import { instancesMultiSelectEditor } from '../../component-extras.js'

describe('wc-shoelace/components/multiInstancesSelect', () => {
  let component: MultiEditorComponent

  beforeEach(async () => {
    component = {
      ...instancesMultiSelectEditor,
      render: await instancesMultiSelectEditor.lazyRender(),
    }
  })

  it('removes triples when cleared', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      objects: [graph.literal('foo'), graph.literal('bar')],
    })

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))
    result.renderRoot.querySelector<SlButton>('[part=clear-button]')!.click()

    // then
    await nextFrame()
    expect(actions.update).to.have.been.calledWith(
      sinon.match([]),
    )
  })

  it('is disabled when dash:readOnly true', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      property: {
        readOnly: true,
      },
      objects: [graph.namedNode('')],
    })

    // when
    const result = await fixture(html`<div>${component.render(params, actions)}</div>`)

    // then
    const select = result.querySelector('sl-select')
    const button = result.querySelector('sl-button')
    expect(select?.disabled).to.be.true
    expect(button?.disabled).to.be.true
  })

  it('uses form settings for display labels', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const {
      params,
      actions,
    } = editorTestParams<InstancesMultiSelect>({
      componentState: {
        instances: [
          graph.namedNode('A').addOut(schema.name, 'Ą'),
          graph.namedNode('Z').addOut(schema.name, 'Ż'),
        ],
      },
      objects: [],
    })
    params.form.labelProperties = [schema.name]

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    const itemLabels = [...result.querySelectorAll('sl-option')]
      .map(item => item.textContent)
    expect(itemLabels).to.contain.all.members(['Ą', 'Ż'])
  })
})
