import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import type { SingleEditorComponent } from '../../models/components/index.js'
import type { FocusNode } from '../../index.js'

/**
 * An interface for implementing dash:EnumSelectEditor
 */
export interface EnumSelectEditor extends SingleEditorComponent {
  choices: GraphPointer[]

  /**
   * Asynchronously load the values for the component
   * @param params
   */
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
  }): Promise<GraphPointer[]>
}
