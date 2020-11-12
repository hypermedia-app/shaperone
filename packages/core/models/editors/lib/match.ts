import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import type { EditorsState, SingleEditor, SingleEditorMatch, Editor, MultiEditor } from '../index'

function toDefined<T>(arr: T[], next: T | undefined): T[] {
  if (!next) {
    return arr
  }

  return [...arr, next]
}

function byScore(left: { score: number | null }, right: { score: number | null }): number {
  const leftScore = left.score || 0
  const rightScore = right.score || 0

  return rightScore - leftScore
}

export function matchSingleEditors(this: EditorsState, { shape, object }: {shape: PropertyShape; object?: GraphPointer }): SingleEditorMatch[] {
  const singleEditors = Object.values(this.singleEditors).reduce<Editor<SingleEditor>[]>(toDefined, [])

  return singleEditors.map(editor => ({ ...editor, score: editor.match(shape, object) }))
    .filter(match => match.score === null || match.score > 0)
    .sort(byScore)
}

export function matchMultiEditors(this: EditorsState, { shape }: { shape: PropertyShape }): Editor<MultiEditor>[] {
  const multiEditors = Object.values(this.multiEditors).reduce<Editor<MultiEditor>[]>(toDefined, [])

  return multiEditors
    .map(editor => ({ editor, score: editor.match(shape) }))
    .filter(match => match.score === null || match.score > 0)
    .sort(byScore)
    .map(e => e.editor)
}
