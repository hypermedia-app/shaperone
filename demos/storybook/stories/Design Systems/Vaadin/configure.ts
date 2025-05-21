import type { ConfigCallback } from 'shaperone'
import { editors, layout } from '@shaperone/vaadin'

export const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(editors)
  renderer.pushComponents(layout)
}
