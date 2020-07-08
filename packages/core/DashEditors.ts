import { PropertyShape } from '@rdfine/shacl'
import type { SingleContextClownface } from 'clownface'
import { dash, sh, xsd, rdf } from '@tpluscode/rdf-ns-builders'
import type { SingleEditor } from './models/editors/index'

export const textField: SingleEditor = {
  term: dash.TextFieldEditor,
  match(shape: PropertyShape, value: SingleContextClownface) {
    let datatype = shape.get(sh.datatype)?.id

    if (value.term.termType === 'Literal') {
      datatype = value.term.datatype
    }

    if (datatype && !datatype.equals(rdf.langString) && !datatype.equals(xsd.boolean)) {
      return 10
    }

    return 0
  },
}

export const textArea: SingleEditor = {
  term: dash.TextAreaEditor,
  match(shape: PropertyShape, value: SingleContextClownface) {
    const singleLine = shape.getBoolean(dash.singleLine)
    if (!singleLine) {
      let datatype = shape.get(sh.datatype)?.id
      if (value.term.termType === 'Literal') {
        datatype = value.term.datatype
      }
      if (datatype?.equals(xsd.string)) {
        if (singleLine === false) {
          return 20
        }
        return 5
      }
    }

    return 0
  },
}

export const shape: SingleEditor = {
  term: dash.DetailsEditor,
  match(shape: PropertyShape, value) {
    if (shape.get(sh.class)) {
      return 20
    }

    if (value.term.termType === 'BlankNode' || value.term.termType === 'NamedNode') {
      return null
    }

    return 0
  },
}
