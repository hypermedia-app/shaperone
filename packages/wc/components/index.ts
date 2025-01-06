export { Sh1Property as PropertyElement } from './sh1-property.js'
export { Sh1Object as ObjectElement } from './sh1-object.js'
export { Sh1FocusNode as FocusNodeElement } from './sh1-focus-node.js'
export { Sh1Group as PropertyGroupElement } from './sh1-group.js'

declare module '@hydrofoil/shaperone-core/models/components/index.js' {
  interface Component extends HTMLElement {
  }

  interface ComponentConstructor extends CustomElementConstructor {
  }
}
