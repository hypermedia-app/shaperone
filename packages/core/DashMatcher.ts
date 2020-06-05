import { PropertyShape } from '@rdfine/shacl'
import type { SingleContextClownface } from 'clownface'
import { dash } from './lib/dash'
import { EditorMatch } from './lib/editorMatcher'

export function matchValueEditor(shape: PropertyShape, value: SingleContextClownface): EditorMatch[] {
  return [{
    editor: dash.TextFieldEditor, score: 2, label: 'Single-line text',
  }, {
    editor: dash.TextAreaEditor, score: 1, label: 'Multi-line text',
  }]
}
