import { Directive, PartInfo, PartType, directive } from 'lit/directive'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { ElementPart, noChange } from 'lit'

class ReadonlyDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('validity directive can only be used in element bindings')
    }
  }

  render(arg: PropertyState) {
    return noChange
  }

  update(part: ElementPart, [{ shape }]: Parameters<ReadonlyDirective['render']>) {
    part.element.setAttribute('readonly', shape.readOnly ? 'readonly' : '')
    part.element.setAttribute('disabled', shape.readOnly ? 'disabled' : '')
  }
}

export const readOnly = directive(ReadonlyDirective)
