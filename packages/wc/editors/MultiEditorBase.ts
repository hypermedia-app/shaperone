import type { MultiEditorComponent } from '@hydrofoil/shaperone-core'
import type { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import type { Term } from '@rdfjs/types'
import type { CustomEventTarget } from '../components/events.js'
import { ComponentBase } from './ComponentBase.js'

/**
 * Inherit to implement a `dash:MultiEditor` component rendered as Web Components using [lit](https://lit.dev/)
 */
export class MultiEditorBase extends ComponentBase implements MultiEditorComponent, CustomEventTarget {
  @property({ type: Object })
  public values!: PropertyObjectState[]

  setValues(values: Term[]) {
    this.dispatchEvent(new CustomEvent('values-changed', {
      detail: {
        values,
      },
      bubbles: true,
    }))
  }
}
