import { Lazy } from '@hydrofoil/shaperone-core'
import * as Core from '@hydrofoil/shaperone-core/components.js'

export const instancesSelect: Lazy<Core.InstancesSelectEditor> = {
  ...Core.instancesSelect,
  async lazyRender() {
    const { select } = await import('./select.js')

    return ({ value, componentState }, { update }) => {
      const pointers = componentState.instances || []

      return select(value, pointers, update)
    }
  },
}
