import { expect } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import { decorator } from '../../../lib/components/multiInstanceSelector.js'

describe('hydra/lib/components/multiInstancesSelector', function () {
  describe('decorator', function () {
    it('applies to Multi Instances Selector', function () {
      // given
      const component = {
        editor: $rdf.ns.sh1.InstancesMultiSelectEditor,
      }

      // then
      expect(decorator.applicableTo(component)).to.be.true
    })
  })
})
