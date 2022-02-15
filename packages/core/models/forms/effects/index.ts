import type { Store } from '../../../state'
import { pushFocusNode } from './pushFocusNode'
import { addObject } from './addObject'
import { selectShape } from './selectShape'
import { replaceObjects } from './replaceObjects'
import { setPropertyObjects } from './setPropertyObjects'
import { updateObject } from './updateObject'
import { setObjectValue } from './setObjectValue'
import { removeObject } from './removeObject'
import { connect, disconnect } from './connection'
import { validate } from './validate'
import { createFocusNodeState } from './createFocusNodeState'

export default function (store: Store) {
  return {
    updateObject: updateObject(store),
    'forms/connect': connect(store),
    'forms/disconnect': disconnect(store),
    pushFocusNode: pushFocusNode(store),
    addObject: addObject(store),
    'forms/selectShape': selectShape(store),
    replaceObjects: replaceObjects(store),
    'forms/setPropertyObjects': setPropertyObjects(store),
    'forms/setObjectValue': setObjectValue(store),
    'forms/removeObject': removeObject(store),
    validate: validate(store),
    'forms/createFocusNodeState': createFocusNodeState(store),
  }
}
