import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Store } from '../../../../state'
import { testStore } from '../../forms/util'
import { loadDash } from '../../../../models/editors/effects'

describe('models/editors/effects/loadDash', () => {
  let store: Store

  beforeEach(() => {
    ({ store } = testStore())
  })

  it('does not add metadata twice', async () => {
    // given
    const effect = loadDash(store)
    await effect()

    // when
    await effect()

    // expect
    const dispatch = store.getDispatch()
    expect(dispatch.editors.addMatchers).to.have.been.calledOnce
    expect(dispatch.editors.addMetadata).to.have.been.calledOnce
  })
})
