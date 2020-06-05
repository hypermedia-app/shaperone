import type { PropertyShape } from '@rdfine/shacl'
import type { NamedNode } from 'rdf-js'
import type { SingleContextClownface } from 'clownface'

export interface EditorMatch {
  score: number | null
  editor: NamedNode
  label: string
}

export interface EditorMatcher {
  matchCompoundEditor?(shape: PropertyShape): EditorMatch[]
  matchValueEditor(shape: PropertyShape, value: SingleContextClownface): EditorMatch[]
}
