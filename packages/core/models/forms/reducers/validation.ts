import type { GraphPointer } from 'clownface'
import type { ValidationReport } from '@rdfine/shacl'
import produce from 'immer'
import { sh } from '@tpluscode/rdf-ns-builders'
import { BaseParams, formStateReducer } from '../../index.js'
import type { FormState, ValidationResultState } from '../index.js'
import env from '../../../env.js'

export interface ValidationReportParams extends BaseParams {
  report: GraphPointer<any> | ValidationReport
}

export const validationReport = formStateReducer((state: FormState, { report }: ValidationReportParams) => produce(state, (draft) => {
  const reportObj = '_context' in report ? env().rdfine.sh.ValidationReport(report) : report

  draft.validationReport = reportObj.pointer
  draft.hasErrors = false
  draft.validationResults = []

  for (const focusNode of Object.values(draft.focusNodes)) {
    focusNode.hasErrors = false
    focusNode.validationResults = []

    for (const property of focusNode.properties) {
      property.hasErrors = false
      property.validationResults = []

      for (const object of property.objects) {
        object.hasErrors = false
        object.validationResults = []
      }
    }
  }

  if (reportObj.conforms || !reportObj.result.length) {
    return
  }

  for (const result of reportObj.result) {
    const isViolation = !result.resultSeverity || result.resultSeverity.equals(sh.Violation)

    const resultState: ValidationResultState = { result, matchedTo: null }

    if (result.focusNode) {
      resultState.matchedTo = 'focusNode'

      const focusNode = draft.focusNodes[result.focusNode.value]
      if (focusNode) {
        const property = focusNode.properties.find(prop => prop.shape.pathEquals(result.resultPath?.pointer))

        if (property) {
          resultState.matchedTo = 'property'

          const object = property.objects.find(o => o.object?.term.equals(result.value))
          if (object) {
            resultState.matchedTo = 'object'
            object.validationResults.push(resultState)
            object.hasErrors = object.hasErrors || isViolation
          }

          property.validationResults.push(resultState)
          property.hasErrors = property.hasErrors || isViolation
        }

        focusNode.validationResults.push(resultState)
        focusNode.hasErrors = focusNode.hasErrors || isViolation
      }
    }

    draft.validationResults.push(resultState)
    draft.hasErrors = draft.hasErrors || isViolation
  }
}))
