import type { Store } from '../../../state'
import { pushFocusNode } from './pushFocusNode'
import { addObject } from './addObject'
import { selectShape } from './selectShape'
import { replaceObjects } from './replaceObjects'
import { setPropertyObjects } from './setPropertyObjects'
import { updateObject } from './updateObject'
import { removeObject } from './removeObject'
import { connect, disconnect } from './connection'

export default function (store: Store) {
  return {
    'forms/connect': connect(store),
    'forms/disconnect': disconnect(store),
    pushFocusNode: pushFocusNode(store),
    addObject: addObject(store),
    'forms/selectShape': selectShape(store),
    replaceObjects: replaceObjects(store),
    'forms/setPropertyObjects': setPropertyObjects(store),
    'forms/updateObject': updateObject(store),
    'forms/removeObject': removeObject(store),
  }
}
