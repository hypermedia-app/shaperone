import type { Store } from '../../../state/index.js'
import { pushFocusNode } from './pushFocusNode.js'
import { addObject } from './addObject.js'
import { selectShape } from './selectShape.js'
import { replaceObjects } from './replaceObjects.js'
import { setPropertyObjects } from './setPropertyObjects.js'
import { updateObject } from './updateObject.js'
import { setObjectValue } from './setObjectValue.js'
import { removeObject } from './removeObject.js'
import { validate } from './validate.js'
import { notify } from './notify.js'
import { createFocusNodeState } from './createFocusNodeState.js'

export default function (store: Store) {
  return {
    updateObject: updateObject(store),
    pushFocusNode: pushFocusNode(store),
    addObject: addObject(store),
    'form/selectShape': selectShape(store),
    replaceObjects: replaceObjects(store),
    'form/setPropertyObjects': setPropertyObjects(store),
    'form/setObjectValue': setObjectValue(store),
    'form/removeObject': removeObject(store),
    validate: validate(store),
    'form/createFocusNodeState': createFocusNodeState(store),
    notify: notify(store),
  }
}
