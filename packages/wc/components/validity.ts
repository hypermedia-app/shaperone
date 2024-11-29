import type { ElementPart } from 'lit'
import { noChange } from 'lit'
import type { PartInfo } from 'lit/directive.js'
import { Directive, directive, PartType } from 'lit/directive.js'
import type { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'

class ValidityDirective extends Directive {
  value?: string
  isValid = true

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

    tb.setCustomValidity(validationResults.map(({ result }) => result.resultMessage || 'Value is not valid').join('; '))
    const isValid = validationResults.length === 0

    if (object?.value !== this.value || this.isValid !== isValid) {
      this.value = object?.value

      tb.reportValidity()
      if (this.isValid !== isValid) {
        this.isValid = isValid
        tb.setAttribute('part', this.isValid ? 'component' : 'component invalid')
      }
    }

    return noChange
  }
}

export const validity = directive(ValidityDirective)
