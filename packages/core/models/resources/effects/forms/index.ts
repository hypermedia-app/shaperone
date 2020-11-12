import type { Store } from '../../../../state'
import addFormField from './addFormField'
import updateObject from './updateObject'
import removeObject from './removeObject'
import replaceObject from './setPropertyObjects'

export default function (store: Store) {
  return {
    'forms/addFormField': addFormField(store),
    'forms/updateObject': updateObject(store),
    'forms/removeObject': removeObject(store),
    'forms/setPropertyObjects': replaceObject(store),
  }
}
