import { NamedNode, Term } from 'rdf-js'
import { html, TemplateResult } from 'lit-element'
import { dash } from '@hydrofoil/shaperone-core'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/state'
import { literal } from '@rdf-esm/data-model'

export interface EditorFactoryParams {
  property: PropertyState
  value: PropertyObjectState
}

export interface EditorFactoryActions {
  update(newValue: Term): void
  pushFocusNode(): void
}

export interface EditorFactory {
  term: NamedNode
  render(params: EditorFactoryParams, actions: EditorFactoryActions): TemplateResult
  loadDependencies?(): Array<Promise<unknown>>
}

export const textFieldEditor = {
  term: dash.TextFieldEditor,

  render({ value }: EditorFactoryParams, { update }: EditorFactoryActions) {
    return html`<input .value="${value.object}" @blur="${(e: any) => update(literal(e.target.value))}">`
  },
}

export const textAreaEditor = {
  term: dash.TextAreaEditor,

  render({ value }: EditorFactoryParams, { update }: EditorFactoryActions) {
    return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object}</textarea>`
  },
}
