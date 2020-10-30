import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { expect, fixture } from '@open-wc/testing'
import * as sinon from 'sinon'
import { TextFieldElement } from '@vaadin/vaadin-text-field'
import { editorTestParams } from '../util'
import { urlEditor } from '../../components/url-editor'

describe('wc-vaadin/components/url-editor', () => {
  it('renders text field', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })

    // when
    const element = await fixture(urlEditor.render(params, actions))

    // then
    expect(element).to.equalSnapshot()
  })

  it('renders field[type=url]', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })
    await Promise.all(urlEditor.loadDependencies!())
    const element = await fixture<TextFieldElement>(urlEditor.render(params, actions))

    // when
    element.focus()
    element.value = 'http://example.com/'
    element.blur()

    // then
    expect(actions.update).to.have.been.calledOnceWith(sinon.match({
      value: 'http://example.com/',
      termType: 'NamedNode',
    }))
  })
})
