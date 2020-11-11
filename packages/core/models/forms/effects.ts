import type { PropertyShape } from '@rdfine/shacl'
import { Term } from 'rdf-js'
import type { Store } from '../../state/index'
import resourcesEffects from './effects/resources'
import shapesEffects from './effects/shapes'
import * as selectShape from './reducers/selectShape'
import { BaseParams } from '../index'
import { FocusNode } from '../../index'
import { pushFocusNode } from './effects/pushFocusNode'

export function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    ...shapesEffects(store),
    ...resourcesEffects(store),
    selectShape({ form, focusNode, shape }: selectShape.Params) {
      const { editors, shapes, resources, forms } = store.getState()
      const graph = resources.get(form)?.graph
      const formState = forms.instances.get(form)
      if (!graph || !formState) {
        return
      }

      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        shape,
        shapes: shapes.get(form)?.shapes || [],
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    },
    addObject({ form, property, focusNode }: { focusNode: FocusNode; property: PropertyShape } & BaseParams) {
      const { editors, resources } = store.getState()
      const graph = resources.get(form)?.graph
      if (!graph) {
        return
      }

      dispatch.forms.addFormField({
        form,
        property,
        focusNode,
        editors: editors.matchSingleEditors({ shape: property }),
      })
    },
    pushFocusNode: pushFocusNode(store),
    replaceObjects({ form, focusNode, property, terms }: {
      focusNode: FocusNode
      property: PropertyShape
      terms: Term[]
    } & BaseParams) {
      const { editors, resources } = store.getState()
      const graph = resources.get(form)?.graph
      if (!graph) {
        return
      }
      const objects = graph.node(terms)

      dispatch.forms.setPropertyObjects({
        form,
        editors,
        focusNode,
        property,
        objects,
      })
    },
  }
}
