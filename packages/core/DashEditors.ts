import { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash, sh, xsd, rdf } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'
import type { SingleEditor } from './models/editors'
import { isString } from './lib/datatypes'

export const textField: SingleEditor = {
  term: dash.TextFieldEditor,
  match(shape: PropertyShape, value: GraphPointer) {
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

const booleanTrue = literal('true', xsd.boolean)
const booleanFalse = literal('false', xsd.boolean)

export const textArea: SingleEditor = {
  term: dash.TextAreaEditor,
  match(shape: PropertyShape, value: GraphPointer) {
    const singleLine = shape.pointer.out(dash.singleLine).term

    if (isString(value)) {
      if (singleLine?.equals(booleanTrue)) {
        return 0
      }
      if (singleLine?.equals(booleanFalse) || value.value.includes('\n')) {
        return 20
      }

      return 5
    }

    if (shape.get(sh.datatype)?.equals(xsd.string)) {
      return 2
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

export const enumSelect: SingleEditor = {
  term: dash.EnumSelectEditor,
  match(shape) {
    return shape.get(sh.in) ? 10 : 0
  },
}

export const datePicker: SingleEditor = {
  term: dash.DatePickerEditor,
  match(shape, value: any) {
    if (xsd.date.equals(value.term.datatype)) {
      return 15
    }
    if (shape.get(sh.datatype)?.equals(xsd.date)) {
      return 5
    }

    return 0
  },
}

export const dateTimePicker: SingleEditor = {
  term: dash.DateTimePickerEditor,
  match(shape, value: any) {
    if (xsd.dateTime.equals(value.term.datatype)) {
      return 15
    }
    if (shape.get(sh.datatype)?.equals(xsd.dateTime)) {
      return 5
    }

    return 0
  },
}
