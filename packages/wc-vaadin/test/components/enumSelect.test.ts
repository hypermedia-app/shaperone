import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams } from '@shaperone/testing'
import { EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
import { enumSelectEditor } from '../../components'

describe('wc-vaadin/components/enumSelect', () => {
  let component: EnumSelectEditor

  before(async () => {
    component = {
      ...enumSelectEditor,
      render: await enumSelectEditor.lazyRender(),
    }
  })

  it('renders an vaadin-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
      componentState: {
        choices: [
          graph.literal('foo'),
          graph.literal('bar'),
        ],
      },
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    expect(result).shadowDom.to.equalSnapshot()
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('bar'),
      componentState: {
        choices: [
          graph.literal('foo'),
          graph.literal('bar'),
        ],
      },
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    expect(result).to.have.property('value', 'bar')
  })
})
