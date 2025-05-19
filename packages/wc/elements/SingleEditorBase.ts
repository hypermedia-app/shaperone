import type { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import type { SingleEditorComponent } from '@hydrofoil/shaperone-core/components.js'
import type { Term } from '@rdfjs/types'
import type { CustomEventTarget } from '../components/events.js'
import { ComponentBase } from './ComponentBase.js'

/**
 * Inherit to implement a `dash:SingleEditor` component rendered as Web Components using [lit](https://lit.dev/)
 */
export class SingleEditorBase<T extends Term = Term> extends ComponentBase implements SingleEditorComponent<T>, CustomEventTarget {
  @property({ type: Object })
  public value!: PropertyObjectState<T>

  setValue(value: Term | string) {
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value,
      },
      bubbles: true,
      composed: true,
    }))
  }
}
