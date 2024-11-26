import type { PropertyShape } from '@rdfine/shacl'

export function preventMutatingReadOnlyProperty<T extends { property: PropertyShape }>(effect: (params: T) => void) {
  return (params: T) => {
    if (params.property.readOnly !== true) {
      effect(params)
    }
  }
}
