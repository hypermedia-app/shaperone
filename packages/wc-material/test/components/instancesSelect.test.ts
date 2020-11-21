import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams, sinon } from '@shaperone/testing'
import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { Select } from '@material/mwc-select'
import { instancesSelectEditor } from '../../components'

describe('wc-material/components/instancesSelect', () => {
  let instancesSelect: InstancesSelectEditor

  before(async () => {
    instancesSelect = {
      ...instancesSelectEditor,
      render: await instancesSelectEditor.lazyRender(),
    }
  })

  it('renders an mwc-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo I'),
          graph.literal('bar').addOut(rdfs.label, 'Bar I'),
        ],
      },
    })

    // when
    const result = await fixture(instancesSelect.render(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode('bar'),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo I'),
          graph.literal('bar').addOut(rdfs.label, 'Bar I'),
        ],
      },
    })

    // when
    const result = await fixture(instancesSelect.render(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })

  it('loads choices if not in state', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('bar'),
    })
    instancesSelect.loadChoices = sinon.spy()

    // when
    await fixture(instancesSelect.render(params, actions))

    // then
    expect(instancesSelect.loadChoices).to.have.been.calledWith(params.property.shape, actions.updateComponentState)
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
    const selectElement = await fixture<Select>(instancesSelect.render(params, actions))

    // when
    selectElement.select(0)

    // then
    expect(actions.update).to.have.been.calledWith(sinon.match({
      value: 'foo',
      termType: 'NamedNode',
    }))
  })
})
