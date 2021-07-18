import { noChange, ElementPart } from 'lit'
import { Directive, directive, PartInfo, PartType } from 'lit/directive.js'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'

class ValidityDirective extends Directive {
  value?: string

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('validity directive can only be used in element bindings')
    }
  }

  render(arg: PropertyObjectState) {
    return noChange
  }

  update(part: ElementPart, [{ object, validationResults }]: Parameters<ValidityDirective['render']>) {
    const tb = part.element as HTMLInputElement

    if (object?.value !== this.value) {
      this.value = object?.value

      tb.setCustomValidity(validationResults.map(({ result }) => result.resultMessage || 'Value is not valid').join('; '))
      tb.setAttribute('part', tb.reportValidity() ? 'component' : 'component invalid')
    }
    return noChange
  }
}

export const validity = directive(ValidityDirective)
