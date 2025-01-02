import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import type { SingleEditorComponent } from '@hydrofoil/shaperone-core/components.js'
import type { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env.js'
import type { Term } from '@rdfjs/types'
import { LitElement } from 'lit'
import type { CustomEventTarget } from '../components/events.js'
import { DependencyLoader } from '../components/DependencyLoader.js'

/**
 * Inherit to implement a `dash:SingleEditor` component rendered as Web Components using [lit](https://lit.dev/)
 */
export class SingleEditorBase<T extends Term = Term> extends DependencyLoader(LitElement) implements SingleEditorComponent<T>, CustomEventTarget {
  @property({ type: Object })
  public value!: PropertyObjectState<T>

  @property({ type: Object })
  public property!: PropertyState

  @property({ type: Object })
  public focusNode!: FocusNodeState

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
    this.dispatchEvent(new CustomEvent('cleared', {
      bubbles: true,
    }))
  }
}
