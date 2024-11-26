/**
 * Exports configuration objects used to set up shaperone
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/configure
 */

import CoreMetadata from '@hydrofoil/shaperone-core/metadata.js'
import type { RequiredEnvironment } from '@hydrofoil/shaperone-core/env.js'
import { setEnv } from '@hydrofoil/shaperone-core/env.js'
import onetime from 'onetime'
import { store } from './store.js'

const { components } = store().dispatch
const { renderer } = store().dispatch
const { editors } = store().dispatch
const { validation } = store().dispatch

const setEnvOnce = onetime(setEnv)

export async function configure(env?: RequiredEnvironment) {
  if (env) {
    setEnvOnce(env)
  } else {
    const zazukoEnv = await import('@zazuko/env/web.js')
    setEnvOnce(zazukoEnv.default)
  }

  await import('./lib/shaperone-form.js')

  editors.addMetadata(CoreMetadata)

  return {
    components,
    renderer,
    editors,
    validation,
  }
}
