import { fixture, expect } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { TextField } from '@material/mwc-textfield'
import { Render } from '@hydrofoil/shaperone-wc'
import { editorTestParams, sinon } from '@shaperone/testing'
import { urlEditor } from '../../components'

describe('wc-material/components/urlEditor', () => {
  let render: Render

  before(async () => {
    render = await urlEditor.lazyRender()
  })

  it('renders field[type=url]', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })

    // when
    const element = await fixture(render(params, actions))

    // then
    expect(element).to.equalSnapshot()
  })

  it('renders field[type=url]', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })
    const element = await fixture<TextField>(render(params, actions))

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
