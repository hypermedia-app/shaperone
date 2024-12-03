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
import store from './store.js'
import * as nativeComponents from './NativeComponents.js'

const { components } = store.dispatch
const { renderer } = store.dispatch
const { editors } = store.dispatch
const { validation } = store.dispatch

const setEnvOnce = onetime(setEnv)

export interface ConfigCallback {
  (arg: {
    components: typeof components
    renderer: typeof renderer
    editors: typeof editors
    validation: typeof validation
  }): void
}

export async function configure(): Promise<void>
export async function configure(env: RequiredEnvironment): Promise<void>
export async function configure(cb: ConfigCallback): Promise<void>
export async function configure(env: RequiredEnvironment, cb: ConfigCallback): Promise<void>
export async function configure(first?: RequiredEnvironment | ConfigCallback, second?: ConfigCallback) {
  let env: RequiredEnvironment | undefined
  let userConfigure: ConfigCallback | undefined

  if (typeof first === 'function') {
    userConfigure = first
  } else {
    env = first
    userConfigure = second
  }
  if (env) {
    setEnvOnce(env)
  }

  editors.addMetadata(CoreMetadata)
  components.pushComponents(nativeComponents)
  await editors.loadDash()

  userConfigure?.({ components, renderer, editors, validation })

  await import('./lib/shaperone-form.js')
}
