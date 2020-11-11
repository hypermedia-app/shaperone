import type { PropertyShape } from '@rdfine/shacl'
import { BaseParams } from '../../forms/reducers'
import type { Store } from '../../../state'
import { FocusNode } from '../../../index'

export interface ChangeDetails {
  focusNode: FocusNode
  property: PropertyShape
}

export class ChangeNotifier {
  listeners: Set<(detail: ChangeDetails) => void> = new Set()

  notify(detail: ChangeDetails): void {
    this.listeners.forEach(l => l(detail))
  }

  onChange(listener: (detail: ChangeDetails) => void) {
    this.listeners.add(listener)
  }
}

export function notify({ store, form, ...params }: BaseParams & { store: Store; focusNode: FocusNode; property: PropertyShape }) {
  const { resources } = store.getState()

  resources.get(form)?.changeNotifier.notify({
    ...params,
  })
}
