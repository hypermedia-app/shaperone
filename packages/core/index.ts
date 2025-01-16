/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core
 */

import type { BlankNode, NamedNode } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import '@rdfine/dash/extensions/sh/PropertyShape'

/**
 * A [focus node](https://www.w3.org/TR/shacl/#focusNodes) is a graph pointer to a Named Node or a Blank Node
 */
export type FocusNode = GraphPointer<BlankNode | NamedNode>
export type { Component, SingleEditorComponent, MultiEditorComponent } from './models/components/index.js'
export type { Editor, SingleEditor, MultiEditor } from './models/editors/index.js'
