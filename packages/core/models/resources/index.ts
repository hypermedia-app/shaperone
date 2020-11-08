import { createModel } from '@captaincodeman/rdx'
import clownface, { AnyPointer } from 'clownface'
import { PropertyShape } from '@rdfine/shacl'
import { dataset } from '@rdf-esm/dataset'
import type { Store } from '../../state'
import { FocusNode } from '../../index'
import * as addObject from '../forms/reducers/addObject'
import * as updateObject from '../forms/reducers/updateObject'
import * as removeObject from '../forms/reducers/removeObject'
import * as selectShape from '../forms/reducers/selectShape'
import { BaseParams } from '../forms/reducers'
import { getPathProperty } from './lib/property'
import { setRoot } from './reducers/setRoot'
import { defaultValue } from './lib/defaultValue'

interface ChangeDetails {
  focusNode: FocusNode
  property: PropertyShape
}

interface ResourceState {
  graph: AnyPointer
  changeNotifier: {
    notify(detail: ChangeDetails): void
    onChange(listener: (detail: ChangeDetails) => void): void
  }
}

export type State = Map<symbol, ResourceState>

function notify({ store, form, ...params }: BaseParams & { store: Store; focusNode: FocusNode; property: PropertyShape }) {
  const { resources } = store.getState()

  resources.get(form)?.changeNotifier.notify({
    ...params,
  })
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

export const resources = createModel({
  state: new Map() as State,
  reducers: {
    connect(map: State, form: symbol) {
      map.set(form, {
        graph: clownface({ dataset: dataset() }).namedNode('').any(),
        changeNotifier: new ChangeNotifier(),
      })

      return map
    },
    setRoot,
  },
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      setRoot({ form }) {
      },
      'forms/addObject': function ({ form, focusNode, property, key }: BaseParams & addObject.Params) {
        const { resources } = store.getState()
        const state = resources.get(form)

        if (state?.graph) {
          if (property.defaultValue) {
            state.graph.node(focusNode)
              .addOut(getPathProperty(property).id, property.defaultValue)

            notify({
              store,
              form,
              property,
              focusNode,
            })
          }

          dispatch.forms.setObjectValue({
            form,
            focusNode,
            property,
            object: key,
            value: property.defaultValue || defaultValue(property, state.graph.node(focusNode)),
          })
        }
      },
      'forms/updateObject': function ({ form, focusNode, property, oldValue, newValue }: BaseParams & updateObject.UpdateObjectParams) {
        const { resources } = store.getState()
        const state = resources.get(form)
        const pathProperty = getPathProperty(property).id
        if (!state?.graph) {
          return
        }

        const objects = state.graph.node(focusNode)
          .out(pathProperty)
          .terms
          .filter(term => !term.equals(oldValue))

        state.graph.node(focusNode)
          .deleteOut(pathProperty)
          .addOut(pathProperty, [...objects, newValue])

        notify({
          store,
          form,
          property,
          focusNode,
        })
      },
      'forms/removeObject': function ({ form, focusNode, property, object: removed }: BaseParams & removeObject.RemoveObjectParams) {
        const { resources } = store.getState()
        const state = resources.get(form)
        if (!state?.graph) {
          return
        }

        const pathProperty = getPathProperty(property)
        const objects = state.graph.node(focusNode).out(pathProperty.id).terms

        state.graph.node(focusNode)
          .deleteOut(pathProperty.id)
          .addOut(pathProperty.id, objects.filter(o => !o.equals(removed.object)))

        notify({
          store,
          form,
          property,
          focusNode,
        })
      },
      'forms/replaceObjects': function ({ form, focusNode, property, terms }: BaseParams & updateObject.ReplaceObjectsParams) {
        const { resources } = store.getState()
        const state = resources.get(form)
        const pathProperty = getPathProperty(property).id

        state?.graph?.node(focusNode)
          .deleteOut(pathProperty)
          .addOut(pathProperty, terms)

        notify({
          store,
          form,
          property,
          focusNode,
        })
      },
      'forms/selectShape': function ({ form, focusNode }: selectShape.Params) {
        const { forms, resources } = store.getState()
        const state = resources.get(form)
        if (!state?.graph) {
          return
        }

        forms.instances.get(form)
          ?.focusNodes[focusNode.value]
          .properties.forEach((property) => {
            dispatch.forms.updatePropertyObjects({
              form,
              focusNode,
              property,
              objects: state.graph.out(getPathProperty(property.shape).id).terms,
            })
          })
      },
    }
  },
})
