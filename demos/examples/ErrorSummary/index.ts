import { decorate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html } from 'lit-html'
import type { ValidationResult } from '@rdfine/shacl'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'

function createMessage(result: ValidationResult) {
  if (result.resultMessage) {
    return result.resultMessage
  }

  if (result.sourceConstraintComponent) {
    return `Violated ${shrink(result.sourceConstraintComponent.id.value)}`
  }

  return 'Form error'
}

export const errorSummary = decorate((focusNode: FocusNodeTemplate) => (context, args) => {
  const summary = context.focusNode.validationResults
    .filter(({ matchedTo }) => matchedTo !== 'object')
    .map(({ result }) => html`<li>${createMessage(result)}</li>`)

  if (summary.length) {
    return html`<ul>${summary}</ul> ${focusNode(context, args)}`
  }

  return focusNode(context, args)
})
