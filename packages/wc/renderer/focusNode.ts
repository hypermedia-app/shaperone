import { FormRenderer, FocusNodeRenderer } from '@hydrofoil/shaperone-core/renderer'
import { TemplateResult } from 'lit-element'
import { NodeShape, PropertyGroup } from '@rdfine/shacl'
import { renderGroup } from './group'

export const renderFocusNode: FormRenderer['renderFocusNode'] = function ({ focusNode }): TemplateResult {
  const { dispatch, form, templates, state } = this.context

  const focusNodeState = state.focusNodes[focusNode.value]
  if (!focusNodeState) {
    dispatch.forms.createFocusNodeState({
      ...this.context,
      ...this.context.state,
      focusNode,
    })
    return templates.initialising()
  }

  const actions = {
    ...this.actions,
    selectGroup: (group: PropertyGroup | undefined) => dispatch.forms.selectGroup({ form, focusNode, group }),
    selectShape: (shape: NodeShape) => dispatch.forms.selectShape({ form, focusNode, shape }),
  }

  const context: FocusNodeRenderer = {
    ...this,
    actions,
    renderGroup,
    focusNode: focusNodeState,
  }

  return templates.focusNode.call(context, { focusNode: focusNodeState })
}
