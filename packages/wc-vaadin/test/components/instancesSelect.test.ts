import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams, sinon } from '@shaperone/testing'
import type { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import { ComboBoxElement } from '@vaadin/vaadin-combo-box'
import { instancesSelectEditor } from '../../components'

describe('wc-vaadin/components/instancesSelect', () => {
  let component: InstancesSelectEditor

  beforeEach(async () => {
    component = {
      ...instancesSelectEditor,
      render: await instancesSelectEditor.lazyRender(),
    }
  })

  it('renders an vaadin-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.literal(''),
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    expect(result.tagName).to.eq('VAADIN-COMBO-BOX')
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.namedNode('bar'),
    })

    // when
    const result = await fixture<ComboBoxElement>(component.render(params, actions)) as any

    // then
    expect(result.selectedItem[0].term.termType).to.eq('NamedNode')
    expect(result.selectedItem[0].value).to.eq('bar')
  })

  it('updates form when value changes', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.namedNode(''),
    })
    const selectElement = await fixture<ComboBoxElement>(component.render(params, actions))

    // when
    selectElement.selectedItem = graph.namedNode('foo')

    // then
    expect(actions.update).to.have.been.calledWith(sinon.match({
      value: 'foo',
      termType: 'NamedNode',
    }))
  })

  it('does not load when template', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.namedNode(''),
    })
    component.shouldLoad = () => false
    component.loadChoices = sinon.spy()
    const selectElement = await fixture<ComboBoxElement>(component.render(params, actions))

    // when
    selectElement.open()

    // then
    expect(component.loadChoices).not.to.have.been.called
  })
})
