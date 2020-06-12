import { PropertyShape } from '@rdfine/shacl'
import type { SingleContextClownface } from 'clownface'
import { dash } from './lib/dash'
import { sh, xsd } from '@tpluscode/rdf-ns-builders'

export const textField = {
  term: dash.TextFieldEditor,
  label: 'Single-line text',
  match(shape: PropertyShape, value?: SingleContextClownface) {
    let datatype = shape.get(sh.datatype)?.id

    if (value?.term.termType === 'Literal') {
      datatype = value?.term.datatype
    }

    if (datatype?.equals(xsd.string)) {
      return 10
    }

    return 0
  },
}

export const textArea = {
  term: dash.TextAreaEditor,
  label: 'Multi-line text',
  match(shape: PropertyShape, value?: SingleContextClownface) {
    const singleLine = shape.getBoolean(dash.singleLine)
    if (!singleLine) {
      let datatype = shape.get(sh.datatype)?.id
      if (value?.term.termType === 'Literal') {
        datatype = value?.term.datatype
      }
      if (datatype?.equals(xsd.string)) {
        if (singleLine === false) {
          return 20
        } else {
          return 5
        }
      }
    }

    return 0
  },
}
