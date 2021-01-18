import { BooleanSelectEditor } from '@hydrofoil/shaperone-core/components'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams, sinon } from '@shaperone/testing'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { Select } from '@material/mwc-select'
import { ListItem } from '@material/mwc-list/mwc-list-item'
import { booleanSelectEditor } from '../../components'

describe('wc-material/components/booleanSelect', () => {
  let booleanSelect: BooleanSelectEditor

  before(async () => {
    booleanSelect = {
      ...booleanSelectEditor,
      render: await booleanSelectEditor.lazyRender(),
    }
  })

  it('renders a mwc-select with selected value', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('true'),
      datatype: xsd.boolean,
    })

    // when
    const element = await fixture<Select>(booleanSelect.render(params, actions))

    // then
    expect(element.querySelector<ListItem>('mwc-list-item[selected]')?.innerText).to.equal('true')
  })

  it('clears when selecting empty', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('true'),
      datatype: xsd.boolean,
    })
    const element = await fixture<Select>(booleanSelect.render(params, actions))

    // when
    element.select(0)

    // then
    expect(actions.clear).to.have.been.calledOnce
  })

  it('update when selection changes', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
      datatype: xsd.boolean,
    })
    const element = await fixture<Select>(booleanSelect.render(params, actions))

    // when
    element.select(1)

    // then
    expect(actions.update).to.have.been.calledOnceWith(sinon.match({
      value: 'true',
      termType: 'Literal',
      datatype: {
        ...xsd.boolean,
      },
    }))
  })

  it('does not run any action on first render', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('foobar'),
      datatype: xsd.boolean,
    })

    // when
    await fixture<Select>(booleanSelect.render(params, actions))

    // then
    expect(actions.clear).not.to.have.been.called
    expect(actions.update).not.to.have.been.called
  })
})
