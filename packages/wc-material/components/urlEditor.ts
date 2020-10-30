import { dash } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdf-esm/data-model'
import { createTextField } from './lib/textFieldFactory'

export const urlEditor = createTextField(dash.URIEditor, {
  type() {
    return 'url'
  },
  createTerm(value: string): NamedNode {
    return namedNode(value)
  },
})
