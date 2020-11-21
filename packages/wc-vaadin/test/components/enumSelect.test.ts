import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams, sinon } from '@shaperone/testing'
import { EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
import { enumSelectEditor } from '../../components'

describe('wc-vaadin/components/enumSelect', () => {
  let component: EnumSelectEditor

  beforeEach(async () => {
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

  it('renders empty vaadin-select when there are no choices', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
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

  it('loads choices if not in state', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('bar'),
    })
    const loadChoices = sinon.spy()
    component.loadChoices = loadChoices

    // when
    await fixture(component.render(params, actions))

    // then
    expect(loadChoices).to.have.been.calledWith(sinon.match({
      property: params.property.shape,
      updateComponentState: actions.updateComponentState,
    }))
  })
})
