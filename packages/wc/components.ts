import { NamedNode, Term } from 'rdf-js'
import { html, TemplateResult } from 'lit-html'
import { dash } from '@hydrofoil/shaperone-core'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/state'
import { literal } from '@rdf-esm/data-model'

interface EditorFactoryParams {
  property: PropertyState
  value: PropertyObjectState
  update(newValue: Term): void
}

export interface EditorFactory {
  term: NamedNode
  render(params: EditorFactoryParams): TemplateResult
  loadDependencies?(): Array<Promise<unknown>>
}

export const textFieldEditor = {
  term: dash.TextFieldEditor,

  render({ value, update }: EditorFactoryParams) {
    return html`<input value="${value.object}" @blur="${(e: any) => update(literal(e.target.value))}">`
  },
}

export const textAreaEditor = {
  term: dash.TextAreaEditor,

  render({ value, update }: EditorFactoryParams) {
    return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object}</textarea>`
  },
}
