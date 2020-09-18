import { describe, it } from 'mocha'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { expect } from 'chai'
import { replaceObjects } from '../../../../models/forms/reducers/updateObject'
import { testFocusNodeState, testState } from '../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/updateObject', () => {
  describe('replaceObjects', () => {
    it('removes all current triples and creates new', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
        .addOut(ex.prop, ['foo1', 'foo2'])
      const property = new PropertyShapeMixin.Class(graph.blankNode(), {
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
      const after = replaceObjects(state, {
        focusNode,
        form,
        property,
        terms: [$rdf.literal('bar1'), $rdf.literal('bar2'), $rdf.literal('bar3')],
      })

      // then
      const { focusNodes: { [focusNode.value]: focusNodeState } } = after.instances.get(form)!
      const values = focusNodeState.properties[0].objects.map(os => os.object.value)
      expect(values).to.have.length(3)
      expect(values).to.include.members(['bar1', 'bar2', 'bar3'])
      expect(focusNodeState.focusNode.out(ex.prop).values).to.include.members(['bar1', 'bar2', 'bar3'])
    })
  })
})
