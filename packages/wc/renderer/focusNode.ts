import { FormRenderer, FocusNodeRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { TemplateResult } from 'lit'
import { NodeShape, PropertyGroup, Shape } from '@rdfine/shacl'
import { renderGroup } from './group.js'

export const renderFocusNode: FormRenderer['renderFocusNode'] = function ({ focusNode, shape }): TemplateResult {
  const { dispatch, form, templates, state } = this.context

  const focusNodeState = focusNode.value && state.focusNodes[focusNode.value]
  if (!focusNodeState || focusNodeState.focusNode.dataset !== focusNode.dataset) {
    dispatch.forms.createFocusNodeState({
      ...this.context,
      ...this.context.state,
      focusNode,
      shape,
    })
    return templates.initialising()
  }

  const actions = {
    ...this.actions,
    selectGroup: (group: PropertyGroup | undefined) => dispatch.forms.selectGroup({ form, focusNode, group }),
    selectShape: (shape: NodeShape) => dispatch.forms.selectShape({ form, focusNode, shape }),
    hideProperty: (shape: Shape) => dispatch.forms.hideProperty({ form, focusNode, shape }),
    showProperty: (shape: Shape) => dispatch.forms.showProperty({ form, focusNode, shape }),
    clearProperty: (shape: Shape) => {
      const property = focusNodeState.properties
        .find(property => property.shape.equals(shape))

      property?.objects.forEach((object) => {
        const args = {
          form,
          focusNode,
          property: property.shape,
          object,
        }

        if (property.canRemove) {
          dispatch.forms.removeObject(args)
        } else {
          dispatch.forms.clearValue(args)
        }
      })
    },
  }

  const context: FocusNodeRenderer = {
    ...this,
    actions,
    renderGroup,
    focusNode: focusNodeState,
  }

  return templates.focusNode(context, { focusNode: focusNodeState })
}
