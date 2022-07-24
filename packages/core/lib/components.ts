import type { GraphPointer } from 'clownface'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import type { SingleEditorComponent } from '../models/components'

export type CoreComponent<T extends SingleEditorComponent<any>> = Omit<T, 'render' | 'lazyRender'>

export function sort(left: GraphPointer, right: GraphPointer): number {
  const leftLabel = getLocalizedLabel(left.out(rdfs.label)) || left.value
  const rightLabel = getLocalizedLabel(right.out(rdfs.label)) || right.value
  return leftLabel.localeCompare(rightLabel)
}
