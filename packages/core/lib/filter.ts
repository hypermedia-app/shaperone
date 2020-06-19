import { PropertyGroup } from '@rdfine/shacl'
import type { PropertyState } from '../state/form'

export function byGroup(group: PropertyGroup | undefined) {
  return (property: PropertyState) => {
    if (!group && !property.shape.group) {
      return true
    }

    if (group && property.shape.group) {
      return group.id.equals(property.shape.group.id)
    }

    return false
  }
}
