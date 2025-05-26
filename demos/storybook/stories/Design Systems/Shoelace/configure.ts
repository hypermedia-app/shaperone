import type { ConfigCallback } from 'shaperone'
import { editors, layoutElements } from '@shaperone/shoelace'

export const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(editors)
  renderer.pushComponents(layoutElements)
}
