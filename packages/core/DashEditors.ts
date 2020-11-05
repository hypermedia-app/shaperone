import { NodeKindEnum, PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash, sh, xsd, rdf } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'
import type { BlankNode, Literal, NamedNode } from 'rdf-js'
import type { SingleEditor } from './models/editors'
import { isString } from './lib/datatypes'

export const textField: SingleEditor = {
  term: dash.TextFieldEditor,
  match(shape: PropertyShape, value: GraphPointer) {
    let datatype = shape.datatype?.id

    if (value.term.termType === 'Literal') {
      datatype = value.term.datatype
    }

    if (datatype && !datatype.equals(rdf.langString) && !datatype.equals(xsd.boolean)) {
      return 10
    }

    return 0
  },
}

export const textFieldWithLang: SingleEditor = {
  term: dash.TextFieldWithLangEditor,
  match(shape: PropertyShape, value: GraphPointer) {
    const valueDatatype = (value.term.termType === 'Literal' && value.term?.datatype) || null
    const propertyDatatype = shape.datatype?.id
    const singleLine = shape.pointer.out(dash.singleLine).term

    if (
      valueDatatype?.equals(rdf.langString) ||
      (
        valueDatatype?.equals(xsd.string) && (
          propertyDatatype?.equals(rdf.langString) ||
          propertyDatatype?.equals(xsd.string)
        )
      )
    ) {
      return 10
    }

    if (
      !singleLine?.equals(booleanFalse) && (
        propertyDatatype?.equals(rdf.langString) ||
        propertyDatatype?.equals(xsd.string)
      )
    ) {
      return 5
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

    if (shape.datatype?.equals(xsd.string)) {
      return 2
    }

    return 0
  },
}

export const textAreaWithLang: SingleEditor = {
  term: dash.TextAreaWithLangEditor,
  match(shape: PropertyShape, value: GraphPointer) {
    const singleLine = shape.pointer.out(dash.singleLine).term
    const valueDatatype = (value.term.termType === 'Literal' && value.term?.datatype) || null
    const propertyDatatype = shape.datatype?.id

    if (singleLine?.equals(booleanTrue)) {
      return 0
    }

    if (singleLine?.equals(booleanFalse) && valueDatatype?.equals(rdf.langString)) {
      return 15
    }

    if (
      valueDatatype?.equals(rdf.langString) ||
      propertyDatatype?.equals(rdf.langString) ||
      propertyDatatype?.equals(rdf.string)
    ) {
      return 5
    }

    return 0
  },
}

export const shape: SingleEditor = {
  term: dash.DetailsEditor,
  match(shape: PropertyShape, value) {
    if (shape.class) {
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
  match(shape, value: GraphPointer) {
    if (!shape.get(sh.in)) {
      return 0
    }

    if (value.value === '') {
      return 20
    }

    return shape.in.some(enumValue => value.term.equals(enumValue)) ? 20 : 6
  },
}

export const datePicker: SingleEditor<Literal> = {
  term: dash.DatePickerEditor,
  match(shape, value) {
    if (xsd.date.equals(value.term.datatype)) {
      return 15
    }
    if (shape.datatype?.equals(xsd.date)) {
      return 5
    }

    return 0
  },
}

export const dateTimePicker: SingleEditor<Literal> = {
  term: dash.DateTimePickerEditor,
  match(shape, value) {
    if (xsd.dateTime.equals(value.term.datatype)) {
      return 15
    }
    if (shape.datatype?.equals(xsd.dateTime)) {
      return 5
    }

    return 0
  },
}

export const instancesSelectEditor: SingleEditor<NamedNode | BlankNode> = {
  term: dash.InstancesSelectEditor,
  match(shape) {
    return shape.class ? null : 0
  },
}

export const uriEditor: SingleEditor<NamedNode> = {
  term: dash.URIEditor,
  match(shape, { term: { termType } }) {
    if (termType !== 'NamedNode' || shape.class) {
      return 0
    }

    return NodeKindEnum.IRI.equals(shape.nodeKind) ? 10 : null
  },
}
