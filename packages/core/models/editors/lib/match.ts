import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'
import type { EditorsState, SingleEditor, SingleEditorMatch, MultiEditor, Editor, MultiEditorMatch } from '../index.js'
import env, { ShaperoneEnvironment } from '../../../env.js'

function toDefined<T extends Editor>(arr: Map<NamedNode, T>, next: T | undefined): Map<NamedNode, T> {
  return !next ? arr : arr.set(next.term, next)
}

function byScore(left: { score: number | null }, right: { score: number | null }): number {
  const leftScore = left.score || 0
  const rightScore = right.score || 0

  return rightScore - leftScore
}

function valuePlaceholder(this: ShaperoneEnvironment, shape: PropertyShape): GraphPointer {
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
      if (shape.languageIn.length || shape.datatype?.equals(this.ns.rdf.langString)) {
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
  const singleEditors = Object.values(this.singleEditors).reduce<Map<NamedNode, SingleEditor>>(toDefined, env().termMap())

  const object = rest.object || valuePlaceholder.bind(env())(shape)
  const preferredEditor = shape.editor?.id
  if (preferredEditor && preferredEditor.termType === 'NamedNode') {
    singleEditors.set(preferredEditor, {
      term: preferredEditor,
      match: () => 100,
    })
  }

  return [...singleEditors.values()].map(editor => ({ ...editor, score: editor.match(shape, object, env()) }))
    .filter(match => match.score === null || match.score > 0)
    .sort(byScore)
}

export function matchMultiEditors(this: EditorsState, { shape }: { shape: PropertyShape }): MultiEditorMatch[] {
  const multiEditors = Object.values(this.multiEditors).reduce<Map<NamedNode, MultiEditor>>(toDefined, env().termMap())

  return [...multiEditors.values()]
    .map(editor => ({ term: editor.term, score: editor.match(shape) }))
    .filter(match => match.score === null || match.score > 0)
    .sort(byScore)
}
