import type { ConfigCallback } from 'shaperone'
import accordionLayout from '@shaperone/vaadin/layout/accordion.js'

export const configure: ConfigCallback = ({ renderer }) => {
  renderer.pushComponents(accordionLayout)
}
