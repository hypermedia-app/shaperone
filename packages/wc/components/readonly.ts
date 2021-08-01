import { Directive, PartInfo, PartType, directive } from 'lit/directive.js'
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
    if (shape.readOnly) {
      part.element.setAttribute('readonly', 'readonly')
      part.element.setAttribute('disabled', 'disabled')
    } else {
      part.element.removeAttribute('readonly')
      part.element.removeAttribute('disabled')
    }
  }
}

export const readOnly = directive(ReadonlyDirective)
