import { describe, it } from 'mocha'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { setPropertyObjects } from '../../../../models/forms/reducers/updateObject'
import { testFocusNodeState, testState, testStore } from '../util'
import { propertyShape } from '../../../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/updateObject', () => {
  describe('setPropertyObjects', () => {
    it('removes all current triples and creates new', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
        .addOut(ex.prop, ['foo1', 'foo2'])
      const property = propertyShape(graph.blankNode(), {
        path: ex.prop,
      })
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [{
                shape: property,
                objects: [],
                name: 'prop',
                canRemove: true,
                canAdd: true,
                editors: [],
                selectedEditor: undefined,
              }],
            }),
          },
        },
      })

      // when
      const after = setPropertyObjects(state, {
        focusNode,
        form,
        property,
        editors: testStore().store.getState().editors,
        objects: graph.node([$rdf.literal('bar1'), $rdf.literal('bar2'), $rdf.literal('bar3')]),
      })

      // then
      const { focusNodes: { [focusNode.value]: focusNodeState } } = after.instances.get(form)!
      const values = focusNodeState.properties[0].objects.map(os => os.object?.value)
      expect(values).to.have.length(3)
      expect(values).to.include.members(['bar1', 'bar2', 'bar3'])
    })
  })
})
