import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/lib/components/instancesSelect'
import { decorator as searchDecorator } from './searchDecorator.js'

export const decorator: ComponentDecorator<InstancesSelectEditor> = {
  ...searchDecorator,
  applicableTo(component) {
    return component.editor.equals(sh1.InstancesMultiSelectEditor)
  },
}
