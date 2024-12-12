/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/renderer
 */

import type { TemplateResult } from 'lit'
import { html } from 'lit'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { Renderer } from '@hydrofoil/shaperone-core/renderer.js'
import { repeat } from 'lit/directives/repeat.js'
import type {
  FocusNodeState,
  FormState,
  PropertyGroupState, PropertyObjectState,
  PropertyState,
} from '@hydrofoil/shaperone-core/models/forms/index.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import type { PropertyGroup } from '@rdfine/shacl'
import * as staticLit from 'lit/static-html.js'
import type { Dispatch } from '@hydrofoil/shaperone-core/state/index.js'
import { getEditorTagName } from '../components/editor.js'

export default <Renderer<TemplateResult>>{
  render(context): TemplateResult {
    const { editors, state, components, dispatch } = context

    if (!editors || !state || !components) {
      return html``
    }

    const actions = {
      truncateFocusNodes: (focusNode: FocusNode) => dispatch.form.truncateFocusNodes({ focusNode }),
      popFocusNode: () => dispatch.form.popFocusNode(),
    }

    return html`
      <sh1-form>
        ${repeat(context.state.focusStack, renderFocusNode(dispatch, context.state))}
      </sh1-form>`
  },
}

function renderFocusNode(dispatch: Dispatch, form: FormState) {
  return (focusNode: FocusNode): TemplateResult => {
    const focusNodeState = form.focusNodes[focusNode.value]
    return html`
      <sh1-focus-node .focusNode="${focusNodeState}">
        ${repeat(focusNodeState.groups, renderGroup(dispatch, focusNodeState))}
      </sh1-focus-node>`
  }
}

function byGroup(group: PropertyGroup | undefined) {
  return (property: PropertyState) => {
    if (!group && !property.shape.group) {
      return true
    }

    if (group && property.shape.group) {
      return group.id.equals(property.shape.group.id)
    }

    return false
  }
}

function onlySingleProperty(property: PropertyState) {
  if (Array.isArray(property.shape.path)) {
    return property.shape.path.length === 1
  }

  return true
}

function renderGroup(dispatch: Dispatch, focusNode: FocusNodeState) {
  return (group: PropertyGroupState): TemplateResult => {
    const properties = focusNode.properties
      .filter(({ hidden }) => !hidden)
      .filter(byGroup(group?.group))
      .filter(onlySingleProperty)
    return html`
      <sh1-group slot="${ifDefined(group.group?.id.value)}" .group="${group}">
        ${repeat(properties, renderProperty(dispatch, focusNode))}
      </sh1-group>`
  }
}

function renderProperty(dispatch: Dispatch, focusNode: FocusNodeState) {
  return (property: PropertyState) => html`
    <sh1-property .dispatch="${dispatch}" .focusNode="${focusNode}" .property="${property}">
      ${repeat(property.objects, renderObject(dispatch, focusNode, property))}
    </sh1-property>`
}

function renderObject(dispatch: Dispatch, focusNode: FocusNodeState, property: PropertyState) {
  return (object: PropertyObjectState) => html`
    <sh1-object .dispatch="${dispatch}" .focusNode="${focusNode}" .object="${object}" .property="${property}">
      ${renderEditor(dispatch, focusNode, property, object)}
    </sh1-object>`
}

function renderEditor(dispatch: Dispatch, focusNode: FocusNodeState, property: PropertyState, object: PropertyObjectState) {
  const { selectedEditor: editor } = object
  if (!editor) {
    return ''
  }

  function focusOnObjectNode() {
    if (object.object?.term.termType === 'NamedNode' || object.object?.term.termType === 'BlankNode') {
      dispatch.form.pushFocusNode({ focusNode: object.object as any, property: property.shape })
    }
  }

  const tagName = staticLit.literal`${staticLit.unsafeStatic(getEditorTagName(editor))}`
  return staticLit.html`<${tagName}
    class="editor"
    .property="${property}"
    .focusNode="${focusNode}"
    .value="${object}"
  ></${tagName}>`
}
