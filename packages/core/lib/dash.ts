import ns, { NamespaceBuilder } from '@rdfjs/namespace'
import { NamedNode } from 'rdf-js'

type Dash = NamespaceBuilder & {
  singeLine: NamedNode
  TextAreaEditor: NamedNode
  TextFieldEditor: NamedNode
}

export const dash: Dash = ns('http://datashapes.org/dash#') as any
