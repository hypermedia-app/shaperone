import type { Store } from '../../../state'
import { pushFocusNode } from './pushFocusNode'
import { addObject } from './addObject'
import { selectShape } from './selectShape'
import { replaceObjects } from './replaceObjects'
import { setPropertyObjects } from './setPropertyObjects'
import { updateObject } from './updateObject'
import { removeObject } from './removeObject'

export default function (store: Store) {
  return {
    pushFocusNode: pushFocusNode(store),
    addObject: addObject(store),
    selectShape: selectShape(store),
    replaceObjects: replaceObjects(store),
    setPropertyObjects: setPropertyObjects(store),
    updateObject: updateObject(store),
    removeObject: removeObject(store),
  }
}
