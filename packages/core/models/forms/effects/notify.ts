// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../state/effectsPlugin.ts" />
import type { PropertyShape } from '@rdfine/shacl'
import type { Store } from '../../../state/index.js'
import type { FocusNode } from '../../../index.js'

export interface NotifyArgs {
  property: PropertyShape
  focusNode: FocusNode
}

export function notify(store: Store) {
  return (detail: NotifyArgs) => {
    store.dispatchEvent(new CustomEvent('changed', { detail }))
  }
}
