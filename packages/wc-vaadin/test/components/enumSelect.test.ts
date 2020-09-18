import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { sh } from '@tpluscode/rdf-ns-builders'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams } from '../util'
import { enumSelect } from '../../components/enumSelect'

describe('wc-vaadin/components/enumSelect', () => {
  it('renders an vaadin-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
    })
    params.property.shape.pointer.addList(sh.in, ['foo', 'bar'])

    // when
    const result = await fixture(enumSelect.render(params, actions))

    // then
    expect(result).shadowDom.to.equalSnapshot()
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('bar'),
    })
    params.property.shape.pointer.addList(sh.in, ['foo', 'bar'])

    // when
    const result = await fixture(enumSelect.render(params, actions))

    // then
    expect(result).to.have.property('value', 'bar')
  })
})
