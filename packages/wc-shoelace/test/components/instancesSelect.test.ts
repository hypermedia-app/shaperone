import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import { SlSelect } from '@shoelace-style/shoelace/dist/shoelace'
import { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/lib/components/instancesSelect'
import { instancesSelect } from '../../components/instancesSelect'

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
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelectEditor>({
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
})
