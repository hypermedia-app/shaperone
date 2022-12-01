import { Lazy } from '@hydrofoil/shaperone-core'
import * as Core from '@hydrofoil/shaperone-core/components.js'

export const enumSelect: Lazy<Core.EnumSelectEditor> = {
  ...Core.enumSelect,
  async lazyRender() {
    const { select } = await import('./select.js')

    return ({ value, componentState, property }, actions) => {
      const pointers = componentState.choices || []

      return select({ value, pointers, actions, property })
    }
  },
}
