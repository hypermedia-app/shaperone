import { numericDatatype } from '@hydrofoil/shaperone-core/lib/datatypes'
import { html } from 'lit-element'
import '@material/mwc-textfield/mwc-textfield'
import { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { Term } from 'rdf-js'
import { TextFieldType } from '@material/mwc-textfield/mwc-textfield-base'

function getType(datatype: ReturnType<typeof numericDatatype> | undefined): TextFieldType {
  if (numericDatatype(datatype)) {
    return 'number'
  }

  return 'text'
}

export const createTextField = function ({ type, createTerm }: { type?: TextFieldType; createTerm?: (value: string) => Term } = {}): RenderSingleEditor {
  return function ({ value, property }, { update }) {
    return html`<mwc-textfield
        .value="${value.object?.value || ''}"
        type="${type || getType(property.datatype)}"
        required
        @blur="${(e: any) => update(createTerm ? createTerm(e.target.value) : e.target.value)}"></mwc-textfield>`
  }
}
