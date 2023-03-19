import { Term } from 'rdf-js'
import { dash, sh, xsd } from '@tpluscode/rdf-ns-builders'
import $rdf from 'rdf-ext'
import type { PropertyShape } from '@rdfine/shacl/lib/PropertyShape'
import type { Dispatch } from '../../../../state'
import type { FocusNode } from '../../../../index'
import type { State } from '../../index'
import type { EditorsState } from '../../../editors'

interface Params {
  dispatch: Dispatch
  forms: State
  editors: EditorsState
  property: PropertyShape
  form: symbol
  focusNode: FocusNode
}

export function syncProperties({ forms, editors, form, focusNode, dispatch, property }: Params) {
  const path = property.getPathProperty()
  if (!path) {
    return
  }

  const focusNodeState = forms.get(form)?.focusNodes[focusNode.value]
  const objectTerms = focusNodeState?.properties.find(p => p.shape.equals(property))
    ?.objects.map(obj => obj.object?.term).filter(Boolean) as Term[] || []

  const propertiesToSync = focusNodeState?.properties
    .filter(prop => prop.shape.pointer.has(sh.equals, path.id).has(dash.hidden, $rdf.literal('true', xsd.boolean)).terms.length > 0)
    .map(({ shape }) => shape) || []

  for (const syncedProperty of propertiesToSync) {
    dispatch.forms.setPropertyObjects({
      form,
      focusNode,
      property: syncedProperty,
      objects: focusNode.node(objectTerms),
      editors,
    })
  }
}
