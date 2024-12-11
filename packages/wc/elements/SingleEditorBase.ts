import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import type { SingleEditorComponent } from '@hydrofoil/shaperone-core/models/components/index.js'
import type { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env.js'
import type { Term } from '@rdfjs/types'

/**
 * Inherit to implement a `dash:SingleEditor` component rendered as Web Components using [lit](https://lit.dev/)
 */
export abstract class SingleEditorBase extends LitElement implements SingleEditorComponent {
  @property({ type: Object })
  protected value!: PropertyObjectState

  @property({ type: Object })
  protected property!: PropertyState

  @property({ type: Object })
  protected focusNode!: FocusNodeState

  @property({ type: Object })
  public env!: ShaperoneEnvironment

  setValue(value: Term | string) {
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value,
      },
      bubbles: true,
    }))
  }

  clear() {
    this.dispatchEvent(new CustomEvent('cleared'))
  }
}
