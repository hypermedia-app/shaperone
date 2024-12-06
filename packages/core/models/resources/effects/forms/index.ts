import type { Store } from '../../../../state/index.js'
import addFormField from './addFormField.js'
import setObjectValue from './setObjectValue.js'
import clearValue from './clearValue.js'
import removeObject from './removeObject.js'
import replaceObject from './setPropertyObjects.js'
import createFocusNodeState from './createFocusNodeState.js'
import { preventMutatingReadOnlyProperty } from './lib/index.js'

export default function (store: Store) {
  const objectEffects = {
    'form/addFormField': addFormField(store),
    'form/setObjectValue': setObjectValue(store),
    'form/clearValue': clearValue(store),
    'form/removeObject': removeObject(store),
    'form/setPropertyObjects': replaceObject(store),
  }

  return {
    ...[...Object.entries(objectEffects)].reduce((effects, [key, effect]) => ({ ...effects, [key]: preventMutatingReadOnlyProperty<any>(effect) }), {}),
    'form/createFocusNodeState': createFocusNodeState(store),
  }
}
