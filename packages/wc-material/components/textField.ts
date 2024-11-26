import { numericDatatype } from '@hydrofoil/shaperone-core/lib/datatypes.js'
import { html } from 'lit'
import '@material/mwc-textfield/mwc-textfield'
import type { Render } from '@hydrofoil/shaperone-wc'
import type { Term } from '@rdfjs/types'
import type { TextFieldType } from '@material/mwc-textfield/mwc-textfield-base.js'
import { readOnly } from '@hydrofoil/shaperone-wc/components/readonly.js'
import type { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env.js'
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
