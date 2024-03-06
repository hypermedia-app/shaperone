import { numericDatatype } from '@hydrofoil/shaperone-core/lib/datatypes'
import { html } from 'lit'
import '@material/mwc-textfield/mwc-textfield'
import { Render } from '@hydrofoil/shaperone-wc'
import type { Term } from '@rdfjs/types'
import { TextFieldType } from '@material/mwc-textfield/mwc-textfield-base'
import { readOnly } from '@hydrofoil/shaperone-wc/components/readonly'
import { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env'
import { validity } from '../directives/validity.js'

function getType(datatype: ReturnType<typeof numericDatatype> | undefined): TextFieldType {
  if (numericDatatype(datatype)) {
    return 'number'
  }

  return 'text'
}

export const createTextField = function ({ type, createTerm }: { type?: TextFieldType; createTerm?: (value: string, env: ShaperoneEnvironment) => Term } = {}): Render {
  return function ({ env, value, property }, { update }) {
    return html`<mwc-textfield
        .value="${value.object?.value || ''}"
        type="${type || getType(property.datatype)}"
        required
        ${validity(value)}
        ${readOnly(property)}
        @blur="${(e: any) => update(createTerm ? createTerm(e.target.value, env) : e.target.value)}"></mwc-textfield>`
  }
}
