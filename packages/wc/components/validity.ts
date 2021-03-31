import { AttributePart, directive, Part } from 'lit-html'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'

const stateMap = new WeakMap()

export const validity = directive(({ object, validationResults }: PropertyObjectState) => async (part: Part) => {
  if (!(part instanceof AttributePart)) {
    throw new Error('validity directive can only be used in attribute bindings')
  }

  const tb = part.committer.element as HTMLInputElement

  tb.setCustomValidity(validationResults.map(({ result }) => result.resultMessage).join('; '))
  if (stateMap.get(part) !== object?.value) {
    stateMap.set(part, object?.value)
    tb.reportValidity()
  }
})
