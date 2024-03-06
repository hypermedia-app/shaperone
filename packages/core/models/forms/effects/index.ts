import type { Store } from '../../../state/index.js'
import { pushFocusNode } from './pushFocusNode.js'
import { addObject } from './addObject.js'
import { selectShape } from './selectShape.js'
import { replaceObjects } from './replaceObjects.js'
import { setPropertyObjects } from './setPropertyObjects.js'
import { updateObject } from './updateObject.js'
import { setObjectValue } from './setObjectValue.js'
import { removeObject } from './removeObject.js'
import { connect, disconnect } from './connection.js'
import { validate } from './validate.js'
import { createFocusNodeState } from './createFocusNodeState.js'

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
