import TermMap from '@rdfjs/term-map'
import { NamedNode, Term } from 'rdf-js'
import { html, TemplateResult } from 'lit-html'
import { dash } from '@hydrofoil/shaperone-core'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/lib/FormState'
import { literal } from '@rdf-esm/data-model'

interface EditorFactoryParams {
  property: PropertyState
  value: PropertyObjectState
  update(newValue: Term): void
}

export interface EditorFactory {
  (params: EditorFactoryParams): TemplateResult
}

const textFieldEditor = ({ value, update }: EditorFactoryParams) => {
  return html`<input value="${value.object}" @blur="${(e: any) => update(literal(e.target.value))}">`
}

const textAreaEditor = ({ value, update }: EditorFactoryParams) => {
  return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object}</textarea>`
}

export class EditorMap extends TermMap<NamedNode, EditorFactory> {
  constructor() {
    super([
      [dash.TextFieldEditor, textFieldEditor],
      [dash.TextAreaEditor, textAreaEditor],
    ])
  }
}
