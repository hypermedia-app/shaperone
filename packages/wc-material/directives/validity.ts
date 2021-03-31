import { directive, Part, AttributePart } from 'lit-html'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'

export const validity = directive(({ validationResults, hasErrors }: PropertyObjectState) => async (part: Part) => {
  if (!(part instanceof AttributePart)) {
    throw new Error('validity directive can only be used in attribute bindings')
  }

  const tb = part.committer.element as any
  await tb.updateComplete
  tb.validityTransform = () => ({ valid: !hasErrors })
  tb.setCustomValidity(validationResults.map(({ result }) => result.resultMessage).join('; '))
  part.setValue(tb.reportValidity() ? 'component' : 'component invalid')
  part.commit()
})
