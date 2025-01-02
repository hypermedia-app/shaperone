import type { ConfigCallback } from '@hydrofoil/shaperone-wc'
import { editors } from '@hydrofoil/shaperone-wc-vaadin'

export const configure: ConfigCallback = ({ components }) => {
  components.pushComponents(editors)
}
