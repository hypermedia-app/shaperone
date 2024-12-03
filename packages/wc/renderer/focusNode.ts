import type { FormRenderer, FocusNodeRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import type { TemplateResult } from 'lit'
import type { NodeShape, PropertyGroup, Shape } from '@rdfine/shacl'
import { renderGroup } from './group.js'

export const renderFocusNode: FormRenderer['renderFocusNode'] = function ({ focusNode, shape }): TemplateResult {
  const { dispatch, templates, state } = this.context

  const focusNodeState = focusNode.value && state.focusNodes[focusNode.value]
  if (!focusNodeState || focusNodeState.focusNode.dataset !== focusNode.dataset) {
    dispatch.form.createFocusNodeState({
      ...this.context,
      ...this.context.state,
      focusNode,
      shape,
    })
    return templates.initialising()
  }

  const actions = {
    ...this.actions,
    selectGroup: (group: PropertyGroup | undefined) => dispatch.form.selectGroup({ focusNode, group }),
    selectShape: (shape: NodeShape) => dispatch.form.selectShape({ focusNode, shape }),
    hideProperty: (shape: Shape) => dispatch.form.hideProperty({ focusNode, shape }),
    showProperty: (shape: Shape) => dispatch.form.showProperty({ focusNode, shape }),
    clearProperty: (shape: Shape) => {
      const property = focusNodeState.properties
        .find(property => property.shape.equals(shape))

      property?.objects.forEach((object) => {
        const args = {
          focusNode,
          property: property.shape,
          object,
        }

        if (property.canRemove) {
          dispatch.form.removeObject(args)
        } else {
          dispatch.form.clearValue(args)
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
