import { describe, it } from 'mocha'
import { expect } from 'chai'
import type { GraphPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import { testFocusNodeState, testFormState, testObjectState, testPropertyState } from '@shaperone/testing/models/form.js'
import { blankNode, namedNode } from '@shaperone/testing/nodeFactory.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { validationReport } from '@hydrofoil/shaperone-core/models/forms/reducers/validation.js'
import { propertyShape } from '@shaperone/testing/util.js'

describe('@hydrofoil/shaperone-core/models/forms/reducers/validation', () => {
  let report: GraphPointer

  beforeEach(() => {
    report = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
  })

  describe('validationReport', () => {
    it('sets report pointer to state', () => {
      // given
      const state = testFormState()

      // when
      const after = validationReport(state, { report })

      // then
      expect(after.validationReport).to.be.ok
    })

    it('clears validation state properties if there are not results', () => {
      // given
      const state = testFormState({
        hasErrors: true,
        validationResults: [{}],
        focusNodes: testFocusNodeState(namedNode(''), {
          hasErrors: true,
          validationResults: [{} as any],
          properties: [testPropertyState(blankNode(), {
            hasErrors: true,
            validationResults: [{} as any],
            objects: [testObjectState(blankNode(), {
              hasErrors: true,
              validationResults: [{} as any],
            })],
          })],
        }),
      })

      // when
      const after = validationReport(state, { report })

      // then
      expect(after.hasErrors).to.be.false
      expect(after.validationResults).to.have.length(0)
      expect(after.focusNodes[''].hasErrors).to.be.false
      expect(after.focusNodes[''].validationResults).to.have.length(0)
      expect(after.focusNodes[''].properties[0].hasErrors).to.be.false
      expect(after.focusNodes[''].properties[0].validationResults).to.have.length(0)
      expect(after.focusNodes[''].properties[0].objects[0].hasErrors).to.be.false
      expect(after.focusNodes[''].properties[0].objects[0].validationResults).to.have.length(0)
    })

    it('sets validation result to object and its parents', () => {
      // given
      const state = testFormState({
        focusNodes: testFocusNodeState(namedNode(''), {
          properties: [testPropertyState(blankNode(), {
            shape: propertyShape({
              path: namedNode('prop'),
            }),
            objects: [testObjectState(blankNode()
              .literal('obj'))],
          })],
        }),
      })
      report.addOut(sh.result, (result) => {
        result
          .addOut(sh.resultSeverity, sh.Violation)
          .addOut(sh.focusNode, namedNode(''))
          .addOut(sh.resultPath, namedNode('prop'))
          .addOut(sh.value, $rdf.literal('obj'))
      })

      // when
      const after = validationReport(state, { report })

      // then
      expect(after.hasErrors).to.be.true
      expect(after.validationResults).to.have.length(1)
      expect(after.validationResults[0].matchedTo).to.eq('object')
      expect(after.focusNodes[''].hasErrors).to.be.true
      expect(after.focusNodes[''].validationResults).to.have.length(1)
      expect(after.focusNodes[''].properties[0].hasErrors).to.be.true
      expect(after.focusNodes[''].properties[0].validationResults).to.have.length(1)
      expect(after.focusNodes[''].properties[0].objects[0].hasErrors).to.be.true
      expect(after.focusNodes[''].properties[0].objects[0].validationResults).to.have.length(1)
    })

    it('assumes default severity is sh:Violation', () => {
      // given
      const state = testFormState()
      report.addOut(sh.result, (result) => {
        result.addOut(sh.focusNode, namedNode(''))
      })

      // when
      const after = validationReport(state, { report })

      // then
      expect(after.hasErrors).to.be.true
    })

    it('does not set .hasErrors if severity is not sh:Violation', () => {
      // given
      const state = testFormState()
      report.addOut(sh.result, (result) => {
        result.addOut(sh.resultSeverity, sh.Warning)
      })

      // when
      const after = validationReport(state, { report })

      // then
      expect(after.hasErrors).to.be.false
    })
  })
})
