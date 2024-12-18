/**
 * Exports base implementation of come components so that they can be easily completed by adding the `render` or `lazyRender` method
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/components
 */

import type { GraphPointer } from 'clownface'
import type { NodeShape } from '@rdfine/shacl'
import type { SingleEditorComponent } from './models/components/index.js'

export type { ComponentConstructor, ComponentDecorator, SingleEditorComponent, MultiEditorComponent } from './models/components/index.js'

/**
 * An interface for implementing dash:BlankNodeEditor
 */
export interface BlankNodeEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:BooleanSelectEditor
 */
export interface BooleanSelectEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:DatePickerEditor
 */
export interface DatePickerEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:DateTimePickerEditor
 */
export interface DateTimePickerEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:DetailsEditor
 */
export interface DetailsEditor extends SingleEditorComponent {
  nodeShape: NodeShape
}

/**
 * An interface for implementing dash:EnumSelectEditor
 */
export interface EnumSelectEditor extends SingleEditorComponent {
  choices: GraphPointer[]

  /**
   * Sets the values for the component
   */
  setChoices(): void
}

/**
 * An interface for implementing dash:InstancesSelectEditor
 */
export interface InstancesSelectEditor extends EnumSelectEditor {
  /**
   * Asynchronously loads an instance selected in the editor
   *
   * Implementors may choose to implement and call it if the Shapes Graph does not contain full representations
   * @param params
   */
  loadInstances?(...params: GraphPointer[]): void
}

/**
 * An interface for implementing dash:AutoCompleteEditor
 */
export interface AutoCompleteEditor extends InstancesSelectEditor {
  freetextQuery?: string
}

/**
 * An interface for implementing dash:RichTextEditor
 */
export interface RichTextEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:TextAreaEditor
 */
export interface TextAreaEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:TextAreaWithLangEditor
 */
export interface TextAreaWithLangEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:TextFieldEditor
 */
export interface TextFieldEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:TextFieldWithLangEditor
 */
export interface TextFieldWithLangEditor extends SingleEditorComponent {
}

/**
 * An interface for implementing dash:URIEditor
 */
export interface URIEditor extends SingleEditorComponent {
}
