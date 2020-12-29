import { IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import type { GraphPointer } from 'clownface'

export function hasAllRequiredVariables(template: IriTemplate, variables: GraphPointer): boolean {
  for (const mapping of template.mapping) {
    const { property, required } = mapping

    if (property && required) {
      if (!variables.out(property.id).terms.length) {
        return false
      }
    }
  }

  return true
}
