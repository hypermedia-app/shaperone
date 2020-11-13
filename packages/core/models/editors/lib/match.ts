import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { xsd } from '@tpluscode/rdf-ns-builders'
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

function valuePlaceholder(shape: PropertyShape): GraphPointer {
  switch (shape.nodeKind?.value) {
    case 'http://www.w3.org/ns/shacl#BlankNode':
    case 'http://www.w3.org/ns/shacl#BlankNodeOrIRI':
    case 'http://www.w3.org/ns/shacl#BlankNodeOrLiteral':
      return shape.pointer.blankNode()
    case 'http://www.w3.org/ns/shacl#IRI':
    case 'http://www.w3.org/ns/shacl#IRIOrLiteral':
      return shape.pointer.namedNode('')
    default: {
      if (shape.class) {
        return shape.pointer.blankNode()
      }
      if (shape.languageIn.length || shape.datatype?.equals(xsd.langString)) {
        return shape.pointer.literal('', shape.languageIn[0] || 'en')
      }
      if (shape.datatype?.id.termType === 'NamedNode') {
        return shape.pointer.literal('', shape.datatype.id)
      }

      return shape.pointer.literal('')
    }
  }
}

export function matchSingleEditors(this: EditorsState, { shape, ...rest }: { shape: PropertyShape; object?: GraphPointer }): SingleEditorMatch[] {
  const singleEditors = Object.values(this.singleEditors).reduce<Editor<SingleEditor>[]>(toDefined, [])

  const object = rest.object || valuePlaceholder(shape)

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
