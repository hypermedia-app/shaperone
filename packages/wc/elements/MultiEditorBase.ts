import type { MultiEditorComponent } from '@hydrofoil/shaperone-core'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import type { Term } from '@rdfjs/types'
import { LitElement } from 'lit'
import type { CustomEventTarget } from '../components/events.js'

/**
 * Inherit to implement a `dash:MultiEditor` component rendered as Web Components using [lit](https://lit.dev/)
 */
export class MultiEditorBase extends LitElement implements MultiEditorComponent, CustomEventTarget {
  @property({ type: Object })
  public values!: PropertyObjectState[]

  @property({ type: Object })
  public property!: PropertyState

  @property({ type: Object })
  public focusNode!: FocusNodeState

  setValues(values: Term[]) {
    this.dispatchEvent(new CustomEvent('values-changed', {
      detail: {
        values,
      },
      bubbles: true,
    }))
  }

  clear() {
    this.dispatchEvent(new CustomEvent('cleared', {
      bubbles: true,
    }))
  }
}
