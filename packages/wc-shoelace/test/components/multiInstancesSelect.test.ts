import { MultiEditorComponent } from '@hydrofoil/shaperone-wc'
import { expect, fixture } from '@open-wc/testing'
import { SlButton, SlSelect } from '@shoelace-style/shoelace'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { multiEditorTestParams, sinon } from '@shaperone/testing'
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
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = multiEditorTestParams({
      objects: [graph.literal('foo'), graph.literal('bar')],
    })

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))
    result.renderRoot.querySelector<SlButton>('[part=clear-button]')!.click()

    // then
    expect(actions.update).to.have.been.calledWith(
      sinon.match([]),
    )
  })
})
