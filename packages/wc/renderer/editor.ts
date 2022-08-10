import { PropertyRenderer, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer'
import { Term } from 'rdf-js'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property'
import { GraphPointer } from 'clownface'
import { ComponentState, MultiEditorComponent, SingleEditorComponent } from '@hydrofoil/shaperone-core/models/components'

export const renderMultiEditor: PropertyRenderer['renderMultiEditor'] = function () {
  const { dispatch, form, state, components, templates } = this.context
  const { property, focusNode } = this

  function update(termsOrStrings : Array<Term | string>) {
    const terms = termsOrStrings.map(termOrString => (typeof termOrString === 'string'
      ? createTerm(property, termOrString)
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

  const { componentState, selectedEditor: editor } = property
  if (!editor) {
    return templates.editor.notFound()
  }
  const component: MultiEditorComponent<any> = components.components[editor.value] as any
  if (!component) {
    return templates.component.notFound.call(this, editor)
  }

  if (!component.render) {
    const componentState = component as ComponentState
    if (componentState.loadingFailed) {
      return templates.component.loadingFailed(componentState.loadingFailed.reason)
    }
    if (!componentState.loading) {
      dispatch.components.load(editor)
    }
    return templates.component.loading()
  }

  if (component.init) {
    const ready = component.init({
      form: state,
      focusNode: focusNode.focusNode,
      property,
      updateComponentState,
      renderer: this,
      componentState,
    }, { update })

    if (!ready) {
      return templates.component.initializing()
    }
  }

  return component.render(
    { form: state, focusNode: focusNode.focusNode, property, updateComponentState, renderer: this, componentState },
    { update },
  )
}

export const renderEditor: ObjectRenderer['renderEditor'] = function () {
  const { dispatch, form, state, components, templates } = this.context
  const { property, focusNode, object } = this

  function update(termOrString: GraphPointer | Term | string) {
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
    return templates.editor.notFound()
  }
  const component: SingleEditorComponent<any> = components.components[editor.value] as any
  if (!component) {
    return templates.component.notFound.call(this, editor)
  }

  if (!component.render) {
    const componentState = component as ComponentState
    if (componentState.loadingFailed) {
      return templates.component.loadingFailed(componentState.loadingFailed.reason)
    }
    if (!componentState.loading) {
      dispatch.components.load(editor)
    }
    return templates.component.loading()
  }
  if (component.init) {
    const ready = component.init({
      form: state,
      focusNode: focusNode.focusNode,
      property,
      updateComponentState,
      value: object,
      renderer: this,
    }, { update, focusOnObjectNode, clear, remove })

    if (!ready) {
      return templates.component.initializing()
    }
  }

  return component.render(
    { form: state, focusNode: focusNode.focusNode, property, value: object, updateComponentState, renderer: this },
    { update, focusOnObjectNode, clear, remove },
  )
}
