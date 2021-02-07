import { html, TemplateResult } from 'lit-element'
import { NodeShape, PropertyGroup } from '@rdfine/shacl'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { byGroup, onlySingleProperty } from '@hydrofoil/shaperone-core/lib/filter'
import { NamedNode, Term } from 'rdf-js'
import { literal } from '@rdf-esm/data-model'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property'
import * as Render from './renderer'

const multiEditor: Render.PropertyRenderer['multiEditor'] = function () {
  const { dispatch, form, components, editors } = this.context
  const { propertyState, focusNodeState } = this
  const { focusNode } = focusNodeState

  function update(termsOrStrings : Array<Term | string>) {
    const terms = termsOrStrings.map(termOrString => (typeof termOrString === 'string'
      ? literal(termOrString, propertyState.datatype)
      : termOrString))

    dispatch.forms.replaceObjects({
      form,
      focusNode,
      property: propertyState.shape,
      terms,
    })
  }

  function updateComponentState(newState: Record<string, any>) {
    dispatch.forms.updateComponentState({
      form,
      focusNode,
      property: propertyState.shape,
      newState,
    })
  }

  const editor = propertyState.selectedEditor
  if (!editor) {
    return html`No editor found for property`
  }
  const component = components.components[editor.value]
  if (!component) {
    return html`No component found for ${editors.allEditors[editor.value]?.meta?.label || editor.value}`
  }

  if (!component.render) {
    if (component.loadingFailed) {
      return html`Failed to load editor`
    }
    if (!component.loading) {
      dispatch.components.load(editor)
    }
    return html`Loading editor`
  }

  return component.render(
    { focusNode, property: propertyState, updateComponentState },
    { update },
  )
}

const editor: Render.ObjectRenderer['editor'] = function () {
  const { dispatch, form, state, components, editors } = this.context
  const { propertyState, focusNodeState, objectState: value } = this
  const { focusNode } = focusNodeState

  function update(termOrString: Term | string) {
    const newValue = typeof termOrString === 'string'
      ? createTerm(propertyState, termOrString)
      : termOrString

    dispatch.forms.updateObject({
      form,
      focusNode,
      property: propertyState.shape,
      object: value,
      newValue,
    })
  }

  function focusOnObjectNode() {
    if (value.object?.term.termType === 'NamedNode' || value.object?.term.termType === 'BlankNode') {
      dispatch.forms.pushFocusNode({ form, focusNode: value.object as any, property: propertyState.shape })
    }
  }

  function clear() {
    dispatch.forms.clearValue({ form, focusNode, property: propertyState.shape, object: value })
  }

  function remove() {
    dispatch.forms.removeObject({ form, focusNode, property: propertyState.shape, object: value })
  }

  function updateComponentState(newState: Record<string, any>) {
    dispatch.forms.updateComponentState({
      form,
      focusNode,
      property: propertyState.shape,
      object: value,
      newState,
    })
  }

  const editor = value.selectedEditor
  if (!editor) {
    return html`No editor found for property`
  }
  const component = components.components[editor.value]
  if (!component) {
    return html`No component found for ${editors.allEditors[editor.value]?.meta?.label || editor.value}`
  }

  if (!component.render) {
    if (component.loadingFailed) {
      return html`Failed to load editor`
    }
    if (!component.loading) {
      dispatch.components.load(editor)
    }
    return html`Loading editor`
  }
  if (component.init) {
    const ready = component.init({
      form: state,
      focusNode,
      property,
      updateComponentState,
      value,
    })

    if (!ready) {
      return html`Initialising component`
    }
  }

  return component.render(
    { form: state, focusNode, property: propertyState, value, updateComponentState },
    { update, focusOnObjectNode, clear, remove },
  )
}

const object: Render.PropertyRenderer['object'] = function ({ value }) {
  const { dispatch, form, templates } = this.context
  const { focusNodeState, propertyState } = this
  const { focusNode } = focusNodeState

  const actions = {
    ...this.actions,
    selectEditor(editor: NamedNode): void {
      dispatch.forms.selectEditor({
        form,
        focusNode,
        property: propertyState.shape,
        object: value,
        editor,
      })
    },
    remove(): void {
      dispatch.forms.removeObject({ form, focusNode, property: propertyState.shape, object: value })
    },
  }

  const context: Render.ObjectRenderer = {
    ...this,
    actions,
    objectState: value,
    editor,
  }

  return templates.object.call(context, { value })
}

const property: Render.GroupRenderer['property'] = function ({ property }) {
  const { dispatch, form, templates } = this.context
  const { focusNodeState } = this
  const { focusNode } = focusNodeState

  const actions = {
    ...this.actions,
    addObject: () => dispatch.forms.addObject({ form, focusNode, property: property.shape }),
    selectMultiEditor: () => dispatch.forms.selectMultiEditor({ form, focusNode, property: property.shape }),
    selectSingleEditors: () => dispatch.forms.selectSingleEditors({ form, focusNode, property: property.shape }),
  }

  const context: Render.PropertyRenderer = {
    ...this,
    actions,
    propertyState: property,
    multiEditor,
    object,
  }

  return templates.property.call(context, { property })
}

const group: Render.FocusNodeRenderer['group'] = function ({ groupState }) {
  const { dispatch, form, templates } = this.context
  const { focusNodeState } = this
  const { focusNode } = focusNodeState

  const properties = focusNodeState.properties
    .filter(byGroup(groupState?.group))
    .filter(onlySingleProperty)
  const actions = {
    ...this.actions,
    selectGroup: () => dispatch.forms.selectGroup({ form, focusNode, group: groupState?.group }),
  }

  const context = {
    ...this,
    actions,
    groupState,
    property,
  }

  return templates.group.call(context, {
    properties,
  })
}

const focusNode: Render.FormRenderer['focusNode'] = function ({ focusNodeState }): TemplateResult {
  const { focusNode } = focusNodeState
  const { dispatch, form, templates } = this.context

  const actions = {
    ...this.actions,
    selectGroup: (group: PropertyGroup | undefined) => dispatch.forms.selectGroup({ form, focusNode, group }),
    selectShape: (shape: NodeShape) => dispatch.forms.selectShape({ form, focusNode, shape }),
  }

  const context: Render.FocusNodeRenderer = {
    ...this,
    actions,
    group,
    focusNodeState,
  }

  return templates.focusNode.call(context, { focusNodeState })
}

export const DefaultRenderer: Render.Renderer = {
  render(context: Render.RenderContext): TemplateResult {
    const { form, editors, state, components, templates, dispatch } = context

    if (!form || !editors || !state || !components) {
      return html``
    }

    const actions = {
      truncateFocusNodes: (focusNode: FocusNode) => dispatch.forms.truncateFocusNodes({ form, focusNode }),
      popFocusNode: () => dispatch.forms.popFocusNode({ form }),
    }

    const renderer: Render.FormRenderer = {
      context,
      actions,
      focusNode,
    }

    return templates.form.call(renderer)
  },
}
