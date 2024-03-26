import { expect, fixture } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import '@vaadin/vaadin-select/vaadin-select'
import { editorTestParams } from '@shaperone/testing'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { enumSelectEditor } from '../../components.js'

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
    const graph = $rdf.clownface()
    const { params, actions } = editorTestParams<EnumSelect>({
      object: graph.literal(''),
      componentState: {
        choices: [
          graph.literal('foo').addOut(rdfs.label, 'foo'),
          graph.literal('bar').addOut(rdfs.label, 'bar'),
        ],
      },
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    await expect(result).shadowDom.to.equalSnapshot()
  })

  it('renders empty vaadin-select when there are no choices', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    await expect(result).shadowDom.to.equalSnapshot()
  })

  it('sets selection to current object', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<EnumSelect>({
      object: graph.literal('bar'),
      componentState: {
        choices: [
          graph.literal('foo').addOut(rdfs.label, 'foo'),
          graph.literal('bar').addOut(rdfs.label, 'bar'),
        ],
      },
    })

    // when
    const result = await fixture(component.render(params, actions))

    // then
    expect(result).to.have.property('value', 'bar')
  })
})
