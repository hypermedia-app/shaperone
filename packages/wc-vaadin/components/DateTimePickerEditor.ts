import { GlobalDependencyLoader, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { spread } from '@open-wc/lit-helpers'
import { dash, sh, xsd } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import env from '@hydrofoil/shaperone-core/env.js'
import { validity } from './validation.js'

export default class extends GlobalDependencyLoader(SingleEditorComponent) {
  static readonly editor = dash.DateTimePickerEditor

  render() {
    return html`<vaadin-date-time-picker ${spread(validity(this.value))}
                                         .label="${localizedLabel(this.property.shape.pointer, { property: sh.name })}"
                                         .value="${this.value.object?.value || ''}" .readonly="${!!this.property.shape.readOnly}"
                                         @value-changed="${(e: CustomEvent) => this.setValue(env().literal(e.detail.value, xsd.dateTime))}"></vaadin-date-time-picker>`
  }

  * dependencies() {
    yield import('@vaadin/date-time-picker')
  }
}
