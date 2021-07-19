import { decorate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html } from '@hydrofoil/shaperone-wc'
import type { ValidationResult } from '@rdfine/shacl'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import TermMap from '@rdf-esm/term-map'
import { Term } from 'rdf-js'

function createMessage(result: ValidationResult) {
  if (result.resultMessage) {
    return result.resultMessage
  }

  if (result.sourceConstraintComponent) {
    return `Violated ${shrink(result.sourceConstraintComponent.id.value)}`
  }

  return 'Unspecified error'
}

type Errors = {
  focusNodes: Map<Term, { properties: Map<Term, ValidationResult[]>; errors: ValidationResult[] }>
  errors: ValidationResult[]
}

const renderResult = (result: ValidationResult) => html`<li>${createMessage(result)}</li>`

function renderSummary({ errors, focusNodes }: Errors) {
  return html`<ul>
    ${errors.map(renderResult)}
    ${[...focusNodes].map(([focusNode, { properties, errors }]) => html`<li>
      ${focusNode.value}:
      <ul>
        ${errors.map(renderResult)}
        ${[...properties].map(([property, messages]) => html`<li>
          ${shrink(property.value)}:
          <ul>
            ${messages.map(renderResult)}
          </ul>
        </li>`)}
      </ul>
    </li>`)}
  </ul>`
}

export const errorSummary = decorate((focusNode: FocusNodeTemplate) => (context, args) => {
  const summary = context.focusNode.validationResults
    .reduce(({ focusNodes, errors }, { result }) => {
      if (result.focusNode) {
        const focusNodeErrors = focusNodes.get(result.focusNode) || { properties: new TermMap(), errors: [] }
        if (result.resultPath) {
          const pathErrors = focusNodeErrors.properties.get(result.resultPath.id)
          if (pathErrors) {
            pathErrors.push(result)
          } else {
            focusNodeErrors.properties.set(result.resultPath.id, [result])
          }
        } else {
          focusNodeErrors.errors.push(result)
        }

        focusNodes.set(result.focusNode, focusNodeErrors)
      } else {
        errors.push(result)
      }

      return { focusNodes, errors }
    }, { focusNodes: new TermMap(), errors: [] } as Errors)

  if (summary.errors.length || summary.focusNodes.size) {
    return html`${renderSummary(summary)} ${focusNode(context, args)}`
  }

  return focusNode(context, args)
})
