import type { LayoutElements } from '@hydrofoil/shaperone-wc'
import * as editors from './components.js'
import property from './elements/Property.js'
import object from './elements/Object.js'
import focusNode from './elements/FocusNode.js'
import button from './elements/Button.js'

export {
  editors,
}

export const layoutElements: LayoutElements = {
  'focus-node': focusNode,
  button,
  object,
  property,
}
