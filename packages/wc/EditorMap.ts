import TermMap from '@rdfjs/term-map'
import { NamedNode } from 'rdf-js'
import { EditorFactory } from './components'

export class EditorMap extends TermMap<NamedNode, EditorFactory> {
  addModule(editors: Record<string, EditorFactory>) {
    return this.add(...Object.values(editors))
  }

  add(...editors: EditorFactory[]) {
    editors.forEach(editor => this.set(editor.term, editor))
    return this
  }
}
