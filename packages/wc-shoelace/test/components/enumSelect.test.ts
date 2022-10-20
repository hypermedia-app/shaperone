import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import { SlSelect } from '@shoelace-style/shoelace/dist/shoelace'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/lib/components/enumSelect'
import { enumSelect } from '../../components/enumSelect'

describe('wc-shoelace/components/enumSelect', () => {
  let component: EnumSelect

  beforeEach(async () => {
    component = {
      ...enumSelect,
      render: await enumSelect.lazyRender(),
    }
  })
  it('is disabled when dash:readOnly true', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<EnumSelectEditor>({
      property: {
        readOnly: true,
      },
      object: graph.literal(''),
    })

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    expect(result.disabled).to.be.true
  })
})
