import { html, Render } from '@hydrofoil/shaperone-wc'
import { BooleanSelectEditor } from '@hydrofoil/shaperone-core/lib/components/booleanSelect'
import { literal } from '@rdf-esm/data-model'
import { xsd } from '@tpluscode/rdf-ns-builders'
import '@vaadin/vaadin-select'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread'
import { validity } from './validation'

export const booleanSelect: Render<BooleanSelectEditor> = ({ value, property }, { update, clear }) => {
  function onChange(e: any) {
    if (e.target.value) {
      update(literal(e.target.value, xsd.boolean))
    } else {
      clear()
    }
  }

  return html`<vaadin-select .value="${value.object?.value || ''}" @change="${onChange}" ${spread(validity(value))} .readonly="${!!property.shape.readOnly}">
    <template>
      <vaadin-list-box>
        <vaadin-item></vaadin-item>
        <vaadin-item>true</vaadin-item>
        <vaadin-item>false</vaadin-item>
      </vaadin-list-box>
    </template>
  </vaadin-select>`
}
