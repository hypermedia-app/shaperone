import { html } from 'lit-element'
import { dash } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'
import type { EditorFactoryActions, EditorFactoryParams } from '@hydrofoil/shaperone-core/models/components'
import type { Component } from './index'

export const textFieldEditor: Component = {
  editor: dash.TextFieldEditor,

  render({ value }: EditorFactoryParams, { update }: EditorFactoryActions) {
    return html`<input .value="${value.object}" @blur="${(e: any) => update(literal(e.target.value))}">`
  },
}

export const textAreaEditor: Component = {
  editor: dash.TextAreaEditor,

  render({ value }: EditorFactoryParams, { update }: EditorFactoryActions) {
    return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object}</textarea>`
  },
}
