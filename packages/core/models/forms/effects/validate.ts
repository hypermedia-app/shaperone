import type { Store } from '../../../state/index.js'
import env from '../../../env.js'

export function validate(store: Store) {
  const dispatch = store.getDispatch()

  return async function () {
    const { shapes, resources, validation } = store.getState()
    const data = resources.graph?.dataset
    const shapesGraph = shapes?.shapesGraph?.dataset
    if (!data || !shapesGraph || !validation.validator) {
      return
    }

    const report = env().clownface(await validation.validator(shapesGraph, data))

    dispatch.form.validationReport({
      report,
    })
  }
}
