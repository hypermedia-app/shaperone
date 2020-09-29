import type { Store } from '../../state/index'

export function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'editors/addMatchers': () => {
      const { editors: { singleEditors, multiEditors } } = store.getState()
      dispatch.forms.setEditors({
        singleEditors: [...Object.values(singleEditors)],
        multiEditors: [...Object.values(multiEditors)],
      })
    },

    /*
    pushFocusNodeState({ focusNode, property, form }: BaseParams) {
      const propertyTargetClass = property.get(sh.class)
      const { editors, forms } = store.getState()
      const formState = forms.get(form)

      if (!propertyTargetClass) {
        return
      }

      const shapePointer = formState?.shapesGraph?.has(sh.targetClass, propertyTargetClass.id).toArray()
      if (!shapePointer?.length) {
        return
      }

      const shape = RdfResource.factory.createEntity<Shape>(shapePointer[0])

      dispatch.forms.pushFocusNode({ form, focusNode })
      dispatch.forms.setFocusNodeState({
        form,
        newState: initialiseFocusNode({ focusNode, shape, editors }),
      })
    },

    recalculateFocusNodes({ form }: { form?: any }) {
      const { editors, forms } = store.getState()
      const formState = forms.get(form)
      if (!formState) {
        return
      }

      const newFocusNodes = Object.values(formState.focusNodes).map(focusNode => {
        const selectedGroup = focusNode.groups.find(g => g.selected)?.group?.id.value

        return initialiseFocusNode({
          shape: focusNode.shape,
          editors,
          focusNode: formState.resourceGraph!.node(focusNode.focusNode.term),
          selectedGroup,
        })
      })

      dispatch.forms.replaceFocusNodes({ form, newStates: newFocusNodes })
    },

    async setShapes({ shapes, form }: { form: any; shapes: DatasetCore | undefined }) {
      if (!shapes) {
        return
      }

      dispatch.forms.setShapesGraph({ form, shapesGraph: shapes })
      dispatch.forms.updateShapePointers({ form })
      dispatch.forms.recalculateFocusNodes({ form })
    },

    async updateShapePointers({ form }: { form: any }) {
      const { forms } = store.getState()
      const formState = forms.get(form)
      if (!formState) return

      const newStates = await Promise.all(Object.values(formState.focusNodes)
        .map(async focusNodeState => {
          return {
            ...focusNodeState,
            shape: await findShape(formState.shapesGraph, focusNodeState.focusNode),
          }
        }))

      dispatch.forms.replaceFocusNodes({ form, newStates })
    },

    async setResource({ form, focusNode }: { form: any; focusNode?: FocusNode }) {
      const { forms, editors } = store.getState()
      const formState = forms.get(form)
      if (!focusNode || !formState) {
        return
      }

      const shape = await findShape(formState?.shapesGraph, focusNode)

      dispatch.forms.setResourceGraph({ form, dataset: focusNode.dataset })

      if (formState.focusStack.length === 0) {
        dispatch.forms.pushFocusNode({ form, focusNode })
        dispatch.forms.setFocusNodeState({
          form,
          newState: initialiseFocusNode({
            focusNode,
            editors,
            shape,
          }),
        })
      } else if (focusNode.term.equals(formState.focusStack[0].term)) {
        dispatch.forms.recalculateFocusNodes({ form })
      } else {
        dispatch.forms.truncateFocusNodes({ form })
        dispatch.forms.pushFocusNode({ form, focusNode })
        dispatch.forms.setFocusNodeState({
          form,
          newState: initialiseFocusNode({
            focusNode,
            editors,
            shape,
          }),
        })
      }
    },

    'shapesGraph/setShapes': function(...arg: any) {
      console.log(arg)
    },
    */
  }
}
