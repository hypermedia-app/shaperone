import { PropertyRenderer, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer'
import { Term } from 'rdf-js'
import { literal } from '@rdf-esm/data-model'
import { html } from 'lit-element'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property'

export const renderMultiEditor: PropertyRenderer['renderMultiEditor'] = function () {
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
    { focusNode, property, updateComponentState, renderer: this },
    { update },
  )
}

export const renderEditor: ObjectRenderer['renderEditor'] = function () {
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
    { form: state, focusNode, property, value: object, updateComponentState, renderer: this },
    { update, focusOnObjectNode, clear, remove },
  )
}
