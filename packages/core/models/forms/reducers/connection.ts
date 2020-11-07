import { PropertyShape } from '@rdfine/shacl'
import type { State } from '../index'
import { FocusNode } from '../../../index'

interface ChangeDetails {
  focusNode: FocusNode
  property: PropertyShape
}

class ChangeNotifier {
  listeners: Set<(detail: ChangeDetails) => void> = new Set()

  notify(detail: ChangeDetails): void {
    this.listeners.forEach(l => l(detail))
  }

  onChange(listener: (detail: ChangeDetails) => void) {
    this.listeners.add(listener)
  }
}

export function connect(map: State, form: symbol): State {
  map.instances.set(form, {
    shapes: [],
    focusNodes: {},
    focusStack: [],
    shouldEnableEditorChoice: () => true,
    changeNotifier: new ChangeNotifier(),
  })
  return map
}

export function disconnect(map: State, form: symbol): State {
  map.instances.delete(form)
  return map
}
