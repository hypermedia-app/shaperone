import { ElementPart, noChange } from 'lit'
import { Directive, directive, PartInfo, PartType } from 'lit/directive.js'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'

class ValidityDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('validity directive can only be used in element bindings')
    }
  }

  render(arg: PropertyObjectState) {
    return noChange
  }

  update(part: ElementPart, [{ validationResults, hasErrors }]: [PropertyObjectState]) {
    const tb = part.element as any

    if (tb.formElement) {
      tb.validityTransform = () => ({ valid: !hasErrors })
      tb.setCustomValidity(validationResults.map(({ result }) => result.resultMessage).join('; '))
      tb.setAttribute('part', tb.reportValidity() ? 'component' : 'component invalid')
    }

    return noChange
  }
}

export const validity = directive(ValidityDirective)
