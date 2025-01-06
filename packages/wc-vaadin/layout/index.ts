import type { LayoutElements } from '@hydrofoil/shaperone-wc'
import PropertyElement from './property.js'
import GroupElement from './group.js'

export default <Partial<LayoutElements>>{
  property: PropertyElement,
  group: GroupElement,
}
