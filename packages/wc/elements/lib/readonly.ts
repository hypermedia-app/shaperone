import type { PartInfo } from 'lit/directive.js'
import { Directive, PartType, directive } from 'lit/directive.js'
import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import type { ElementPart } from 'lit'
import { noChange } from 'lit'

class ReadonlyDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('validity directive can only be used in element bindings')
    }
  }

  render(arg: PropertyState | undefined) {
    return noChange
  }

  update(part: ElementPart, [state]: Parameters<ReadonlyDirective['render']>) {
    if (state?.shape.readOnly) {
      part.element.setAttribute('readonly', 'readonly')
      part.element.setAttribute('disabled', 'disabled')
    } else {
      part.element.removeAttribute('readonly')
      part.element.removeAttribute('disabled')
    }
  }
}

export const readOnly = directive(ReadonlyDirective)
