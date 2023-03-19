import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import { TextField, TextFieldEditor } from '@hydrofoil/shaperone-core/lib/components/textField'
import { SlInput } from '@shoelace-style/shoelace'
import { textField } from '../../components.js'

describe('wc-shoelace/components/textField', () => {
  let component: TextField

  beforeEach(async () => {
    component = {
      ...textField,
      render: await textField.lazyRender(),
    }
  })

  it('is readonly when dash:readOnly true', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<TextFieldEditor>({
      property: {
        readOnly: true,
      },
      object: graph.namedNode(''),
    })

    // when
    const result = await fixture<SlInput>(component.render(params, actions))

    // then
    expect(result.readonly).to.be.true
  })
})
