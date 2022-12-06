import { Lazy } from '@hydrofoil/shaperone-core'
import * as Core from '@hydrofoil/shaperone-core/components.js'

export const instancesSelect: Lazy<Core.InstancesSelectEditor> = {
  ...Core.instancesSelect,
  async lazyRender() {
    const { select } = await import('./select.js')

    return ({ value, property, componentState, form }, actions) => {
      const pointers = componentState.instances || []

      return select({ property, value, pointers, actions, form })
    }
  },
}
