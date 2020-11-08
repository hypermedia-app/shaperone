import { PropertyShape } from '@rdfine/shacl'
import { Term } from 'rdf-js'
import type { SingleEditor, SingleEditorMatch } from '../index'

export function matchEditors(shape: PropertyShape, object: Term, editors: SingleEditor[]): SingleEditorMatch[] {
  return editors.map(editor => ({ ...editor, score: editor.match(shape, object) }))
    .filter(match => match.score === null || match.score > 0)
    .sort((left, right) => {
      const leftScore = left.score || 0
      const rightScore = right.score || 0

      return rightScore - leftScore
    })
}
