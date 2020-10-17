import type { State } from '../index'

export function connect(map: State, form: any): State {
  map.instances.set(form, {
    shapes: [],
    focusNodes: {},
    focusStack: [],
    shouldEnableEditorChoice: () => true,
  })
  return map
}

export function disconnect(map: State, form: any): State {
  map.instances.delete(form)
  return map
}
