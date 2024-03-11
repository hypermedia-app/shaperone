/**
 * Default editor matchers implementing [DASH](http://datashapes.org/forms.html#editors).
 *
 * While most editors try to be true to the DASH specification, some may slightly differ
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/DashEditors
 */

import type { PropertyShape } from '@rdfine/shacl'
import { NodeKindEnum } from '@rdfine/shacl'
import { dash, sh, xsd, rdf } from '@tpluscode/rdf-ns-builders'
import type { BlankNode, Literal, NamedNode } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import type { SingleEditor } from './models/editors/index.js'
import { isString } from './lib/datatypes.js'

/**
 * Matcher for `dash:TextFieldEditor`
 *
 * @returns `10` if value has datatype other than `rdf:langString` or `xsd:boolean`
 * @returns `0` otherwise
 */
export const textField: SingleEditor = {
  term: dash.TextFieldEditor,
  match(shape: PropertyShape, value) {
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

/**
 * Matcher for `dash:TextFieldWithLangEditor`
 *
 * @returns `11` if value is tagged literal or shape permits both `xsd:string` and `rdf:langString`
 * @returns `5` if shape is not `dash:singleLine` and shape permits `rdf:langString`
 * @returns `0` otherwise
 */
export const textFieldWithLang: SingleEditor = {
  term: dash.TextFieldWithLangEditor,
  match(shape: PropertyShape, value: GraphPointer, env) {
    const valueDatatype = (value.term.termType === 'Literal' && value.term?.datatype) || null
    const singleLine = shape.pointer.out(dash.singleLine).term

    if (
      valueDatatype?.equals(rdf.langString) ||
      (
        shape.permitsDatatype(rdf.langString) &&
        shape.permitsDatatype(xsd.string)
      )
    ) {
      return 11
    }

    if (
      !singleLine?.equals(env.constant.FALSE) &&
      shape.permitsDatatype(rdf.langString)
    ) {
      return 5
    }

    return 0
  },
}

/**
 * Matcher for `dash:TextAreaEditor`
 *
 * @returns `20` if value is a string containing new line characters or `?shape dash:singleLine false`
 * @returns `5` if value is a string
 * @returns `2` if `?shape sh:datatype xsd:string`
 * @return `0` otherwise
 */
export const textArea: SingleEditor = {
  term: dash.TextAreaEditor,
  match(shape: PropertyShape, value, env) {
    const singleLine = shape.pointer.out(dash.singleLine).term

    if (isString(value.term)) {
      if (singleLine?.equals(env.constant.TRUE)) {
        return 0
      }
      if (singleLine?.equals(env.constant.FALSE) || value.value.includes('\n')) {
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

/**
 * Matcher for `dash:TextAreaWithLangEditor`
 *
 * @returns `15` if `?shape dash:singleLine false` and value is tagged literal
 * @returns `5` if value is tagged literal, or shape permits `rdf:langString` or shape permits `rdf:string`
 * @returns `0` if `?shape dash:singleLine false`
 * @returns `0` otherwise
 */
export const textAreaWithLang: SingleEditor = {
  term: dash.TextAreaWithLangEditor,
  match(shape: PropertyShape, value: GraphPointer, env) {
    const singleLine = shape.pointer.out(dash.singleLine).term
    const valueDatatype = (value.term.termType === 'Literal' && value.term?.datatype) || null

    if (singleLine?.equals(env.constant.TRUE)) {
      return 0
    }

    if (singleLine?.equals(env.constant.FALSE) && valueDatatype?.equals(rdf.langString)) {
      return 15
    }

    if (
      valueDatatype?.equals(rdf.langString) ||
      shape.permitsDatatype(rdf.langString) ||
      shape.permitsDatatype(xsd.string)
    ) {
      return 5
    }

    return 0
  },
}

/**
 * Matcher for `dash:DetailsEditor`
 *
 * @returns `null` if value is Blank Node or IRI
 * @returns `0` otherwise
 */
export const detailsEditor: SingleEditor = {
  term: dash.DetailsEditor,
  match(shape: PropertyShape, value) {
    if (value.term.termType === 'BlankNode' || value.term.termType === 'NamedNode') {
      return null
    }

    return 0
  },
}

/**
 * Matcher for `dash:EnumSelectEditor`
 *
 * @returns `0` if shape does not have `sh:in`
 * @returns `20` if value is empty string or value is one of `sh:in`
 * @returns `11` otherwise
 */
export const enumSelect: SingleEditor = {
  term: dash.EnumSelectEditor,
  match(shape, value) {
    if (!shape.get(sh.in)) {
      return 0
    }

    if (value?.value === '') {
      return 20
    }

    return shape.in.some(enumValue => value?.term.equals(enumValue)) ? 20 : 11
  },
}

/**
 * Matcher for `dash:DatePickerEditor`
 *
 * @returns `15` if value has datatype `xsd:date`
 * @returns `5` if `?shape sh:datatype xsd:date`
 * @returns `0` otherwise
 */
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

/**
 * Matcher for `dash:DateTimePickerEditor`
 *
 * @returns `15` if value has datatype `xsd:dateTime`
 * @returns `5` if `?shape sh:datatype xsd:dateTime`
 * @returns `0` otherwise
 */
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

/**
 * Matcher for `dash:InstancesSelectEditor`
 *
 * @returns `0` if `?shape sh:class ?class`
 * @returns `null` otherwise
 */
export const instancesSelectEditor: SingleEditor<NamedNode | BlankNode> = {
  term: dash.InstancesSelectEditor,
  match(shape) {
    return shape.class ? null : 0
  },
}

/**
 * Matcher for `dash:BooleanSelectEditor`
 *
 * @returns `10` if value is boolean literal or `?shape sh:datatype xsd:boolean`
 * @returns `null` if shape accepts literals of unspecified datatype
 * @returns `0` if value or `sh:datatype` and not `xsd:boolean`
 */
export const booleanSelectEditor: SingleEditor = {
  term: dash.BooleanSelectEditor,
  match(shape, object) {
    const { nodeKind, datatype } = shape

    if (object.term.termType !== 'Literal' || (datatype && !datatype.id.equals(xsd.boolean))) {
      return 0
    }
    if (object.term.datatype.equals(xsd.boolean) || datatype?.id.equals(xsd.boolean)) {
      return 10
    }

    const acceptsLiterals = nodeKind && (
      nodeKind.equals(NodeKindEnum.BlankNodeOrLiteral) ||
      nodeKind.equals(NodeKindEnum.IRIOrLiteral) ||
      nodeKind.equals(NodeKindEnum.Literal)
    )

    if (acceptsLiterals && !datatype) {
      return null
    }

    return 0
  },
}

/**
 * Matcher for `dash:UriEditor`
 *
 * @returns `0` if value is not Named Node
 * @returns `0` if shape has `sh:class`
 * @returns `10` if `?shape sh:nodeKind sh:IRI`
 * @returns `null` otherwise
 */
export const uriEditor: SingleEditor<NamedNode> = {
  term: dash.URIEditor,
  match(shape, object) {
    if (object.term.termType !== 'NamedNode' || shape.class) {
      return 0
    }

    return NodeKindEnum.IRI.equals(shape.nodeKind) ? 10 : null
  },
}
