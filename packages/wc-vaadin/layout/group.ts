import { PropertyGroupElement } from 'shaperone/components/index.js'
import type { TemplateResult } from 'lit'
import { html } from 'lit'
import { GlobalDependencyLoader } from 'shaperone'

const responsiveSteps = [
  // Use one column by default
  { minWidth: 0, columns: 1 },
  // Use two columns, if layout's width exceeds 500px
  { minWidth: '500px', columns: 2 },
]

export default class extends GlobalDependencyLoader(PropertyGroupElement) {
  * dependencies() {
    yield import('@vaadin/form-layout').then(m => this.registry?.define('vaadin-form-layout', m.FormLayout))
  }

  renderWhenReady(): TemplateResult<1> {
    return html`<vaadin-form-layout .responsiveSteps="${responsiveSteps}">
      ${super.renderGroup()}
    </vaadin-form-layout>`
  }
}
