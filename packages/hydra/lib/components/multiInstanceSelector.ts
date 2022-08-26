import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/lib/components/instancesSelect'
import { decorator as base } from './searchDecorator.js'

export function decorator(...args: Parameters<typeof base>): ComponentDecorator<InstancesSelectEditor> {
  return {
    ...base(...args),
    applicableTo(component) {
      return component.editor.equals(sh1.InstancesMultiSelectEditor)
    },
  }
}
