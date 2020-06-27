import { PropertyShape } from '@rdfine/shacl'
import type { SingleContextClownface } from 'clownface'
import { dash, sh, xsd } from '@tpluscode/rdf-ns-builders'
import { ValueEditor } from './models/editors/index'

export const textField: ValueEditor = {
  term: dash.TextFieldEditor,
  match(shape: PropertyShape, value: SingleContextClownface) {
    let datatype = shape.get(sh.datatype)?.id

    if (value.term.termType === 'Literal') {
      datatype = value.term.datatype
    }

    if (datatype?.equals(xsd.string)) {
      return 10
    }

    return 0
  },
}

export const textArea: ValueEditor = {
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

export const shape = {
  term: dash.CompoundEditor,
  match(shape: PropertyShape) {
    if (shape.get(sh.class)) {
      return 20
    }

    return 0
  },
}
