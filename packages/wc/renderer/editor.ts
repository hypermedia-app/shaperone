import type { PropertyRenderer, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import type { Term } from '@rdfjs/types'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property.js'
import type { GraphPointer } from 'clownface'
import type { ComponentState, MultiEditorComponent, SingleEditorComponent } from '@hydrofoil/shaperone-core/models/components'

export const renderMultiEditor: PropertyRenderer['renderMultiEditor'] = function () {
  const { dispatch, env, state, components, templates } = this.context
  const { property, focusNode } = this

  function update(termsOrStrings : Array<Term | string>) {
    const terms = termsOrStrings.map(termOrString => (typeof termOrString === 'string'
      ? createTerm(env, property, termOrString)
      : termOrString))

    dispatch.form.replaceObjects({
      focusNode: focusNode.focusNode,
      property: property.shape,
      terms,
    })
  }

  function updateComponentState(newState: Record<string, any>) {
    dispatch.form.updateComponentState({
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
      env,
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
    { env, form: state, focusNode: focusNode.focusNode, property, updateComponentState, renderer: this, componentState },
    { update },
  )
}

export const renderEditor: ObjectRenderer['renderEditor'] = function () {
  const { dispatch, env, state, components, templates } = this.context
  const { property, focusNode, object } = this

  function update(termOrString: GraphPointer | Term | string) {
    const newValue = typeof termOrString === 'string'
      ? createTerm(env, property, termOrString)
      : termOrString

    dispatch.form.updateObject({
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
      newValue,
    })
  }

  function focusOnObjectNode() {
    if (object.object?.term.termType === 'NamedNode' || object.object?.term.termType === 'BlankNode') {
      dispatch.form.pushFocusNode({ focusNode: object.object as any, property: property.shape })
    }
  }

  function clear() {
    dispatch.form.clearValue({
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
    })
  }

  function remove() {
    dispatch.form.removeObject({
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
    })
  }

  function updateComponentState(newState: Record<string, any>) {
    dispatch.form.updateComponentState({
      focusNode: focusNode.focusNode,
      property: property.shape,
      object,
      newState,
    })
  }

  const { componentState, selectedEditor: editor } = object
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
      env,
      form: state,
      focusNode: focusNode.focusNode,
      property,
      componentState,
      updateComponentState,
      value: object,
      renderer: this,
    }, { update, focusOnObjectNode, clear, remove })

    if (!ready) {
      return templates.component.initializing()
    }
  }

  return component.render(
    {
      env,
      form: state,
      focusNode: focusNode.focusNode,
      property,
      value: object,
      componentState,
      updateComponentState,
      renderer: this,
    },
    { update, focusOnObjectNode, clear, remove },
  )
}
