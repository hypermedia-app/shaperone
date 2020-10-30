import { fixture, expect } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { TextField } from '@material/mwc-textfield'
import * as sinon from 'sinon'
import { urlEditor } from '../../components/urlEditor'
import { editorTestParams } from '../util'

describe('wc-material/components/urlEditor', () => {
  it('renders field[type=url]', async () => {
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
    const element = await fixture<TextField>(urlEditor.render(params, actions))

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
