import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture } from '@open-wc/testing'
import { editorTestParams, sinon } from '@shaperone/testing'
import { SelectElement } from '@vaadin/vaadin-select'
import { booleanSelect } from '../../components/booleanSelect'

describe('wc-vaadin/components/booleanSelect', () => {
  it('renders a vaadin-select with selected value', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params } = editorTestParams({
      object: graph.literal('true'),
      datatype: xsd.boolean,
    })

    // when
    const element = await fixture<SelectElement>(booleanSelect(params))

    // then
    expect(element.value).to.equal('true')
  })

  it('clears when selecting empty', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params } = editorTestParams({
      object: graph.literal('true'),
      datatype: xsd.boolean,
    })
    const element = await fixture<SelectElement>(booleanSelect(params))

    // when
    element.value = ''
    element.dispatchEvent(new Event('change'))

    // then
    expect(params.actions.clear).to.have.been.calledOnce
  })

  it('update when selection changes', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params } = editorTestParams({
      object: graph.literal(''),
      datatype: xsd.boolean,
    })
    const element = await fixture<SelectElement>(booleanSelect(params))

    // when
    element.value = 'true'
    element.dispatchEvent(new Event('change'))

    // then
    expect(params.actions.update).to.have.been.calledOnceWith(sinon.match({
      value: 'true',
      termType: 'Literal',
      datatype: {
        ...xsd.boolean,
      },
    }))
  })
})
