import { describe, it } from 'mocha'
import { expect } from 'chai'
import clownface, { GraphPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { testFocusNodeState, testFormState, testObjectState, testPropertyState } from '@shaperone/testing/models/form'
import { blankNode, namedNode } from '@shaperone/testing/nodeFactory'
import { sh } from '@tpluscode/rdf-ns-builders'
import { validationReport } from '@hydrofoil/shaperone-core/models/forms/reducers/validation'
import { propertyShape } from '@shaperone/testing/util'

describe('@hydrofoil/shaperone-core/models/forms/reducers/validation', () => {
  let report: GraphPointer

  beforeEach(() => {
    report = clownface({ dataset: $rdf.dataset() }).blankNode()
  })

  describe('validationReport', () => {
    it('sets report pointer to state', () => {
      // given
      const { form, state } = testFormState()

      // when
      const after = validationReport(state, { form, report })

      // then
      expect(after.get(form)?.validationReport).to.be.ok
    })

    it('clears validation state properties if there are not results', () => {
      // given
      const { form, state } = testFormState({
        form: {
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
        },
      })

      // when
      const after = validationReport(state, { form, report })

      // then
      expect(after.get(form)?.hasErrors).to.be.false
      expect(after.get(form)?.validationResults).to.have.length(0)
      expect(after.get(form)?.focusNodes[''].hasErrors).to.be.false
      expect(after.get(form)?.focusNodes[''].validationResults).to.have.length(0)
      expect(after.get(form)?.focusNodes[''].properties[0].hasErrors).to.be.false
      expect(after.get(form)?.focusNodes[''].properties[0].validationResults).to.have.length(0)
      expect(after.get(form)?.focusNodes[''].properties[0].objects[0].hasErrors).to.be.false
      expect(after.get(form)?.focusNodes[''].properties[0].objects[0].validationResults).to.have.length(0)
    })

    it('sets validation result to object and its parents', () => {
      // given
      const { form, state } = testFormState({
        form: {
          focusNodes: testFocusNodeState(namedNode(''), {
            properties: [testPropertyState(blankNode(), {
              shape: propertyShape({
                path: namedNode('prop'),
              }),
              objects: [testObjectState(blankNode().literal('obj'))],
            })],
          }),
        },
      })
      report.addOut(sh.result, (result) => {
        result
          .addOut(sh.resultSeverity, sh.Violation)
          .addOut(sh.focusNode, namedNode(''))
          .addOut(sh.resultPath, namedNode('prop'))
          .addOut(sh.value, $rdf.literal('obj'))
      })

      // when
      const after = validationReport(state, { form, report })

      // then
      expect(after.get(form)?.hasErrors).to.be.true
      expect(after.get(form)?.validationResults).to.have.length(1)
      expect(after.get(form)?.validationResults[0].matchedTo).to.eq('object')
      expect(after.get(form)?.focusNodes[''].hasErrors).to.be.true
      expect(after.get(form)?.focusNodes[''].validationResults).to.have.length(1)
      expect(after.get(form)?.focusNodes[''].properties[0].hasErrors).to.be.true
      expect(after.get(form)?.focusNodes[''].properties[0].validationResults).to.have.length(1)
      expect(after.get(form)?.focusNodes[''].properties[0].objects[0].hasErrors).to.be.true
      expect(after.get(form)?.focusNodes[''].properties[0].objects[0].validationResults).to.have.length(1)
    })

    it('assumes default severity is sh:Violation', () => {
      // given
      const { form, state } = testFormState()
      report.addOut(sh.result, (result) => {
        result.addOut(sh.focusNode, namedNode(''))
      })

      // when
      const after = validationReport(state, { form, report })

      // then
      expect(after.get(form)?.hasErrors).to.be.true
    })

    it('does not set .hasErrors if severity is not sh:Violation', () => {
      // given
      const { form, state } = testFormState()
      report.addOut(sh.result, (result) => {
        result.addOut(sh.resultSeverity, sh.Warning)
      })

      // when
      const after = validationReport(state, { form, report })

      // then
      expect(after.get(form)?.hasErrors).to.be.false
    })
  })
})
