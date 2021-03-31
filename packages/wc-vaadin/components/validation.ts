import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'

export function validity(value: PropertyObjectState): Record<string, any> {
  return {
    '.invalid': value.hasErrors,
    '.errorMessage': value.validationResults.map(({ result }) => result.resultMessage).join('; '),
  }
}
