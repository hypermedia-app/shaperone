import type { ConfigCallback } from '@hydrofoil/shaperone-wc'
import accordionLayout from '@hydrofoil/shaperone-wc-vaadin/layout/accordion.js'

export const configure: ConfigCallback = ({ renderer }) => {
  renderer.pushComponents(accordionLayout)
}
