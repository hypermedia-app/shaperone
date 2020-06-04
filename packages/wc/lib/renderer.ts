import { TemplateResult, html } from 'lit-element'
import type { PropertyGroup, PropertyShape } from '@rdfine/shacl'

export class LitHtmlRenderer {
  appendEditor(group: PropertyGroup, prop: PropertyShape, value?): void {

  }

  getResult(): TemplateResult {
    return html`Foo`
  }
}
