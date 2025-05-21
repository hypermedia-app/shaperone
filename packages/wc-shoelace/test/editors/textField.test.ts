import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect } from '@open-wc/testing'
import defineComponent from '@hydrofoil/shaperone-wc/test/defineComponent.js'
import { setEnv } from '@hydrofoil/shaperone-core/env.js'
import { TextField } from '../../components.js'

describe('wc-shoelace/components/textField', function () {
  before(function () {
    setEnv($rdf)
  })

  beforeEach(defineComponent(TextField, { awaitEvent: 'sh1-ready' }))

  it('is readonly when dash:readOnly true', async function () {
    // given
    const params = editorTestParams({
      property: {
        readOnly: true,
      },
    })

    // when
    const result = await this.component.render(params)

    // then
    expect(result.readonly).to.be.true
  })
})
