import type { Store } from '../../../../state'
import addFormField from './addFormField'
import setObjectValue from './setObjectValue'
import clearValue from './clearValue'
import removeObject from './removeObject'
import replaceObject from './setPropertyObjects'
import createFocusNodeState from './createFocusNodeState'
import { preventMutatingReadOnlyProperty } from './lib'

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
