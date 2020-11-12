import type { State } from '../index'

export function connect(map: State, form: symbol): State {
  map.set(form, {
    focusNodes: {},
    focusStack: [],
    shouldEnableEditorChoice: () => true,
  })
  return map
}

export function disconnect(map: State, form: symbol): State {
  map.delete(form)
  return map
}
