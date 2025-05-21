import { dash } from '@tpluscode/rdf-ns-builders'
import { property } from 'lit/decorators.js'
import type { NodeShape } from '@rdfine/shacl'
import type { FocusNodeState } from '@shaperone/core/models/forms/index.js'
import type { BlankNode, NamedNode } from '@rdfjs/types'
import type { DetailsEditor } from '@shaperone/core/components.js'
import type { PropertyValues } from 'lit'
import { SingleEditorComponent } from '../index.js'

export default class extends SingleEditorComponent<NamedNode | BlankNode> implements DetailsEditor {
  static editor = dash.DetailsEditor

  @property({ type: Object })
  public nodeShape?: NodeShape

  @property({ type: Object })
  public objectNode?: FocusNodeState

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)

    const nodeShapeShapeChanged = _changedProperties.has('nodeShape') && this.nodeShape && !this.nodeShape.equals(_changedProperties.get('nodeShape'))
    const objectChanged = _changedProperties.has('value') && this.value?.object && !this.value.object.term?.equals(_changedProperties.get('value')?.object.term)

    if (nodeShapeShapeChanged || objectChanged) {
      this.initObjectState()
    }
  }

  initObjectState() {
    const { value: { object }, nodeShape } = this

    if (object && nodeShape && this.focusNode) {
      this.dispatchEvent(new CustomEvent('init-object-state', {
        bubbles: true,
        composed: true,
        detail: {
          propertyShape: this.property.shape.id,
          focusNode: object,
          shape: nodeShape,
        },
      }))
    }
  }
}
