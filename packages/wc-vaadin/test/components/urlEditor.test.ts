import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { expect, fixture } from '@open-wc/testing'
import { TextFieldElement } from '@vaadin/vaadin-text-field'
import { editorTestParams, sinon } from '@shaperone/testing'
import { urlEditor } from '../../components/url-editor'

describe('wc-vaadin/components/url-editor', () => {
  it('renders text field', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })

    // when
    const element = await fixture(urlEditor(params))

    // then
    expect(element).to.equalSnapshot({
      ignoreAttributes: ['aria-labelledby'],
    })
  })

  it('renders field[type=url]', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })
    const element = await fixture<TextFieldElement>(urlEditor(params))

    // when
    element.focus()
    element.value = 'http://example.com/'
    element.blur()

    // then
    expect(params.actions.update).to.have.been.calledOnceWith(sinon.match({
      value: 'http://example.com/',
      termType: 'NamedNode',
    }))
  })
})
