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
    'forms/addFormField': addFormField(store),
    'forms/setObjectValue': setObjectValue(store),
    'forms/clearValue': clearValue(store),
    'forms/removeObject': removeObject(store),
    'forms/setPropertyObjects': replaceObject(store),
  }

  return {
    ...[...Object.entries(objectEffects)].reduce((effects, [key, effect]) => ({ ...effects, [key]: preventMutatingReadOnlyProperty<any>(effect) }), {}),
    'forms/createFocusNodeState': createFocusNodeState(store),
  }
}
