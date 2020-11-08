import { PropertyShape } from '@rdfine/shacl'
import type { State } from '../index'
import { FocusNode } from '../../../index'

interface ChangeDetails {
  focusNode: FocusNode
  property: PropertyShape
}

export function connect(map: State, form: symbol): State {
  map.instances.set(form, {
    shapes: [],
    focusNodes: {},
    focusStack: [],
    shouldEnableEditorChoice: () => true,
  })
  return map
}

export function disconnect(map: State, form: symbol): State {
  map.instances.delete(form)
  return map
}
