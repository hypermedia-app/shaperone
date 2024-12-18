import type { ConfigCallback } from '@hydrofoil/shaperone-wc'
import { editors, layoutElements } from '@hydrofoil/shaperone-wc-shoelace'

export const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(editors)
  renderer.pushComponents(layoutElements)
}
