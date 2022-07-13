import { IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import type { MultiPointer } from 'clownface'

export function hasAllRequiredVariables(template: IriTemplate, variables: MultiPointer): boolean {
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
