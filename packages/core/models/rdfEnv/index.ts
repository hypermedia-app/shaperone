import { createModel } from '@captaincodeman/rdx'
import Environment from '@zazuko/env-core'
import { RequiredEnvironment, ShaperoneEnvironment } from '../../env.js'
import PropertyShapeEx from '../shapes/lib/PropertyShape.js'
import shaperoneEnv from '../../lib/env/index.js'

export const env = createModel(({
  state: <ShaperoneEnvironment><any>null,
  reducers: {
    setEnv(state: ShaperoneEnvironment, env: ShaperoneEnvironment) {
      return env
    },
  },
  effects(store) {
    const dispatch = store.getDispatch()

    return {
      async use(env: RequiredEnvironment) {
        let newState: ShaperoneEnvironment

        if (isShaperoneEnvironment(env)) {
          newState = env
        } else {
          newState = new Environment(shaperoneEnv, { parent: env })
        }

        const deps = await import('../../lib/mixins.js')
        newState.rdfine().factory.addMixin(PropertyShapeEx)
        Object.values(deps).forEach((bundle) => {
          newState.rdfine().factory.addMixin(...bundle)
        })

        dispatch.env.setEnv(newState)
      },
    }
  },
}))

function isShaperoneEnvironment(env: RequiredEnvironment): env is ShaperoneEnvironment {
  return 'sh1' in env.ns
}
