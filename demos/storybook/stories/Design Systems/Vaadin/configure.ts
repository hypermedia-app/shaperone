import type { ConfigCallback } from '@hydrofoil/shaperone-wc'
import { editors, layout } from '@hydrofoil/shaperone-wc-vaadin'

export const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(editors)
  renderer.pushComponents(layout)
}
