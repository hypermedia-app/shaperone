import type { Component } from '@shaperone/core'
import { LitElement } from 'lit'
import type { FocusNodeState, PropertyState } from '@shaperone/core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { rdfs } from '@tpluscode/rdf-ns-builders'

export abstract class ComponentBase extends LitElement implements Component {
  @property({ type: Object })
  public property!: PropertyState

  @property({ type: Object })
  public focusNode!: FocusNodeState

  @property({ type: Array })
  public labelProperties: NamedNode[] = [rdfs.label]

  get readonly() {
    return this.property.shape.readOnly || false
  }

  clear() {
    this.dispatchEvent(new CustomEvent('cleared', {
      bubbles: true,
      composed: true,
    }))
  }
}
