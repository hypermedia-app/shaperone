import type { Store } from '../../../state'
import { BaseParams } from '../../index'

export function validate(store: Store) {
  const dispatch = store.getDispatch()

  return async function ({ form }: BaseParams) {
    const { shapes, resources, validation } = store.getState()
    const data = resources.get(form)?.graph.dataset
    const shapesGraph = shapes.get(form)?.shapesGraph?.dataset
    if (!data || !shapesGraph || !validation.validator) {
      return
    }

    const report = await validation.validator(shapesGraph, data)

    dispatch.forms.validationReport({
      form,
      report,
    })
  }
}
