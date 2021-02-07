import { html, TemplateResult } from 'lit-element'
import { NodeShape, PropertyGroup } from '@rdfine/shacl'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { byGroup, onlySingleProperty } from '@hydrofoil/shaperone-core/lib/filter'
import { NamedNode, Term } from 'rdf-js'
import { literal } from '@rdf-esm/data-model'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property'
import * as Render from './renderer'

const renderMultiEditor: Render.PropertyRenderer['renderMultiEditor'] = function () {
  const { dispatch, form, components, editors } = this.context
  const { property, focusNode } = this

  function update(termsOrStrings : Array<Term | string>) {
    const terms = termsOrStrings.map(termOrString => (typeof termOrString === 'string'
      ? literal(termOrString, property.datatype)
      : termOrString))

    dispatch.forms.replaceObjects({
      form,
      focusNode: focusNode.focusNode,
      property: property.shape,
      terms,
    })
  }

  function updateComponentState(newState: Record<string, any>) {
    dispatch.forms.updateComponentState({
      form,
      focusNode: focusNode.focusNode,
      property: property.shape,
      newState,
    })
  }

  const editor = property.selectedEditor
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
    { focusNode, property, updateComponentState },
    { update },
  )
}

const renderEditor: Render.ObjectRenderer['renderEditor'] = function () {
  const { dispatch, form, state, components, editors } = this.context
  const { property, focusNode, object } = this

  function update(termOrString: Term | string) {
    const newValue = typeof termOrString === 'string'
      ? createTerm(property, termOrString)
      : termOrString

    dispatch.forms.updateObject({
      form,
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
      newValue,
    })
  }

  function focusOnObjectNode() {
    if (object.object?.term.termType === 'NamedNode' || object.object?.term.termType === 'BlankNode') {
      dispatch.forms.pushFocusNode({ form, focusNode: object.object as any, property: property.shape })
    }
  }

  function clear() {
    dispatch.forms.clearValue({
      form,
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
    })
  }

  function remove() {
    dispatch.forms.removeObject({
      form,
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
    })
  }

  function updateComponentState(newState: Record<string, any>) {
    dispatch.forms.updateComponentState({
      form,
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
      newState,
    })
  }

  const editor = object.selectedEditor
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
      value: object,
    })

    if (!ready) {
      return html`Initialising component`
    }
  }

  return component.render(
    { form: state, focusNode, property, value: object, updateComponentState },
    { update, focusOnObjectNode, clear, remove },
  )
}

const renderObject: Render.PropertyRenderer['renderObject'] = function ({ object }) {
  const { dispatch, form, templates } = this.context
  const { focusNode, property } = this

  const actions = {
    ...this.actions,
    selectEditor(editor: NamedNode): void {
      dispatch.forms.selectEditor({
        form,
        focusNode: focusNode.focusNode,
        property: property.shape,
        object,
        editor,
      })
    },
    remove(): void {
      dispatch.forms.removeObject({ form, focusNode: focusNode.focusNode, property: property.shape, object })
    },
  }

  const context: Render.ObjectRenderer = {
    ...this,
    actions,
    object,
    renderEditor,
  }

  return templates.object.call(context, { object })
}

const renderProperty: Render.GroupRenderer['renderProperty'] = function ({ property }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const actions = {
    ...this.actions,
    addObject: () => dispatch.forms.addObject({ form, focusNode: focusNode.focusNode, property: property.shape }),
    selectMultiEditor: () => dispatch.forms.selectMultiEditor({ form, focusNode: focusNode.focusNode, property: property.shape }),
    selectSingleEditors: () => dispatch.forms.selectSingleEditors({ form, focusNode: focusNode.focusNode, property: property.shape }),
  }

  const context: Render.PropertyRenderer = {
    ...this,
    actions,
    property,
    renderMultiEditor,
    renderObject,
  }

  return templates.property.call(context, { property })
}

const renderGroup: Render.FocusNodeRenderer['renderGroup'] = function ({ group }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const properties = focusNode.properties
    .filter(byGroup(group?.group))
    .filter(onlySingleProperty)
  const actions = {
    ...this.actions,
    selectGroup: () => dispatch.forms.selectGroup({ form, focusNode: focusNode.focusNode, group: group?.group }),
  }

  const context: Render.GroupRenderer = {
    ...this,
    actions,
    group,
    renderProperty,
  }

  return templates.group.call(context, {
    properties,
  })
}

const renderFocusNode: Render.FormRenderer['renderFocusNode'] = function ({ focusNode }): TemplateResult {
  const { dispatch, form, templates } = this.context

  const actions = {
    ...this.actions,
    selectGroup: (group: PropertyGroup | undefined) => dispatch.forms.selectGroup({ form, focusNode: focusNode.focusNode, group }),
    selectShape: (shape: NodeShape) => dispatch.forms.selectShape({ form, focusNode: focusNode.focusNode, shape }),
  }

  const context: Render.FocusNodeRenderer = {
    ...this,
    actions,
    renderGroup,
    focusNode,
  }

  return templates.focusNode.call(context, { focusNode })
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
      renderFocusNode,
    }

    return templates.form.call(renderer)
  },
}
