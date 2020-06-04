declare module '@rdfjs/term-map' {
  import { Term } from 'rdf-js'

  interface TermMap<T extends Term = Term, V = any> extends Map<T, V> {
  }

  class TermMap<T extends Term = Term, V = any> {
    constructor(entries?: Array<[Term, V]>);
  }

  export = TermMap
}
