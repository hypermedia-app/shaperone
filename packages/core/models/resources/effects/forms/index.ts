import type { Store } from '../../../../state'
import addFormField from './addFormField'
import updateObject from './updateObject'
import clearValue from './clearValue'
import removeObject from './removeObject'
import replaceObject from './setPropertyObjects'
import createFocusNodeState from './createFocusNodeState'

export default function (store: Store) {
  return {
    'forms/addFormField': addFormField(store),
    'forms/updateObject': updateObject(store),
    'forms/clearValue': clearValue(store),
    'forms/removeObject': removeObject(store),
    'forms/setPropertyObjects': replaceObject(store),
    'forms/createFocusNodeState': createFocusNodeState(store),
  }
}
