import { expect } from '@open-wc/testing'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { decorator } from '../../../lib/components/multiInstanceSelector'

describe('hydra/lib/components/multiInstancesSelector', () => {
  describe('decorator', () => {
    it('applies to Multi Instances Selector', () => {
      // given
      const component = {
        editor: sh1.InstancesMultiSelectEditor,
      }

      // then
      expect(decorator().applicableTo(component)).to.be.true
    })
  })
})
