import type { Term } from '@rdfjs/types'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import type { PropertyShape } from '@rdfine/shacl/lib/PropertyShape'
import type { Dispatch } from '../../../../state/index.js'
import type { FocusNode } from '../../../../index.js'
import type { State } from '../../index.js'
import type { EditorsState } from '../../../editors/index.js'
import env from '../../../../env.js'

interface Params {
  dispatch: Dispatch
  form: State
  editors: EditorsState
  property: PropertyShape
  focusNode: FocusNode
}

export function syncProperties({ form, editors, focusNode, dispatch, property }: Params) {
  const path = property.getPathProperty()
  if (!path) {
    return
  }

  const focusNodeState = form.focusNodes[focusNode.value]
  const objectTerms = focusNodeState?.properties.find(p => p.shape.equals(property))
    ?.objects.map(obj => obj.object?.term).filter(Boolean) as Term[] || []

  const propertiesToSync = focusNodeState?.properties
    .filter(prop => prop.shape.pointer.has(sh.equals, path.id).has(dash.hidden, env().constant.TRUE).terms.length > 0)
    .map(({ shape }) => shape) || []

  for (const syncedProperty of propertiesToSync) {
    dispatch.form.setPropertyObjects({
      focusNode,
      property: syncedProperty,
      objects: focusNode.node(objectTerms),
      editors,
    })
  }
}
