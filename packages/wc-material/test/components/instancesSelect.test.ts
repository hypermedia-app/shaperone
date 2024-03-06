import { aTimeout, expect, fixture } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import { editorTestParams, sinon } from '@shaperone/testing'
import { InstancesSelectEditor, InstancesSelect } from '@hydrofoil/shaperone-core/components'
import { Select } from '@material/mwc-select'
import { ListItem } from '@material/mwc-list/mwc-list-item'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { instancesSelectEditor } from '../../components.js'

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
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.literal(''),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo I'),
          graph.literal('bar'),
        ],
      },
    })

    // when
    const result = await fixture<Select>(instancesSelect.render(params, actions))

    // then
    expect(result.items.map(i => i.value)).to.deep.eq(['foo', 'bar'])
  })

  it('sets selection to current object', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.namedNode('bar'),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'Foo I'),
          graph.namedNode('bar').addOut(rdfs.label, 'Bar I'),
        ],
      },
    })

    // when
    const result = await fixture<Select>(instancesSelect.render(params, actions))

    // then
    expect(result.querySelector<ListItem>('mwc-list-item[selected]')?.innerText).to.match(/Bar I/)
  })

  it('updates form when value changes', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      object: graph.namedNode(''),
      componentState: {
        instances: [
          graph.namedNode('foo').addOut(rdfs.label, 'foo'),
        ],
      },
    })
    const selectElement = await fixture<Select>(instancesSelect.render(params, actions))

    // when
    selectElement.select(0)
    await aTimeout(100)

    // then
    expect(actions.update).to.have.been.calledWith(sinon.match({
      value: 'foo',
      termType: 'NamedNode',
    }))
  })
})
