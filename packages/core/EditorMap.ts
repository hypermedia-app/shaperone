import TermMap from '@rdfjs/term-map'
import { NamedNode } from 'rdf-js'
import { PropertyShape } from '@rdfine/shacl'
import type { SingleContextClownface } from 'clownface'
import { EditorMatch } from './lib/editorMatcher'

export interface EditorDefinition {
  term: NamedNode
  label: string
  match(shape: PropertyShape, value?: SingleContextClownface): number | null
}

export interface Editor {
  term: NamedNode
  label: string
  match(shape: PropertyShape, value?: SingleContextClownface): EditorMatch
}

export interface CompoundEditor {
  term: NamedNode
  label: string
  match(shape: PropertyShape): EditorMatch
}

export class EditorMap extends TermMap<NamedNode, Editor> {
  constructor(...editors: Record<string, EditorDefinition>[]) {
    const mapInit = editors.reduce<[NamedNode, Editor][]>((array, record) => {
      return Object.values(record).reduce((array, editorDefinition) => {
        const editor: Editor = {
          ...editorDefinition,
          match: (shape, value) => {
            const score = editorDefinition.match(shape, value)

            return {
              editor: editorDefinition.term,
              label: editorDefinition.label,
              score,
            }
          },
        }

        return [
          ...array,
          [editor.term, editor],
        ]
      }, array)
    }, [])

    super(mapInit)
  }
}
