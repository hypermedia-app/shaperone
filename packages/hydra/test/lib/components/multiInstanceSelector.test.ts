import { expect } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import { decorator } from '../../../lib/components/multiInstanceSelector.js'

describe('hydra/lib/components/multiInstancesSelector', () => {
  describe('decorator', () => {
    it('applies to Multi Instances Selector', () => {
      // given
      const component = {
        editor: $rdf.ns.sh1.InstancesMultiSelectEditor,
      }

      // then
      expect(decorator.applicableTo(component)).to.be.true
    })
  })
})
