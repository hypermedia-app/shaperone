import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams, sinon } from '@shaperone/testing'
import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { SelectElement } from '@vaadin/vaadin-select'
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
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo I'),
          graph.namedNode('bar').addOut(rdfs.label, 'Bar I'),
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
      object: graph.namedNode('bar'),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo I'),
          graph.namedNode('bar').addOut(rdfs.label, 'Bar I'),
        ],
      },
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    expect(result).to.have.property('value', 'Bar I')
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

  it('updates form when value changes', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode(''),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo'),
        ],
      },
    })
    const selectElement = await fixture<SelectElement>(component.render(params, actions))

    // when
    selectElement.value = 'Foo'
    selectElement.dispatchEvent(new Event('change'))

    // then
    expect(actions.update).to.have.been.calledWith(sinon.match({
      value: 'foo',
      termType: 'NamedNode',
    }))
  })
})
