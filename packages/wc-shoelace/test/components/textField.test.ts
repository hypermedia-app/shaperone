import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import type { TextField, TextFieldEditor } from '@hydrofoil/shaperone-core/lib/components/textField.js'
import type { SlInput } from '@shoelace-style/shoelace'
import { textField } from '../../components.js'

describe('wc-shoelace/components/textField', function () {
  let component: TextField

  beforeEach(async function () {
    component = {
      ...textField,
      render: await textField.lazyRender(),
    }
  })

  it('is readonly when dash:readOnly true', async function () {
    // given
    const graph = $rdf.clownface()
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
