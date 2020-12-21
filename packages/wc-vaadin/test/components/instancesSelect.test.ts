import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams, sinon } from '@shaperone/testing'
import { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
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
    const result = await fixture<ComboBoxElement>(component.render(params, actions))

    // then
    expect(result.selectedItem).to.have.property('label', 'bar')
  })

  it('updates form when value changes', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.namedNode(''),
    })
    const selectElement = await fixture<ComboBoxElement>(component.render(params, actions))

    // when
    selectElement.selectedItem = {
      value: graph.namedNode('foo'),
    }

    // then
    expect(actions.update).to.have.been.calledWith(sinon.match({
      value: 'foo',
      termType: 'NamedNode',
    }))
  })
})
