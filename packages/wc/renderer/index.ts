/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/renderer
 */

import type { TemplateResult } from 'lit'
import { nothing, html } from 'lit'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { RenderContext, Renderer } from '@hydrofoil/shaperone-core/renderer.js'
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
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import type { NamedNode } from '@rdfjs/types'
import { spread } from '@open-wc/lit-helpers'
import { isResource } from 'is-graph-pointer'
import env from '@hydrofoil/shaperone-core/env.js'
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
        ${repeat(context.state.focusStack, renderFocusNode(context, context.state))}
      </sh1-form>`
  },
}

function renderFocusNode(context: RenderContext, form: FormState) {
  return (focusNode: FocusNode): TemplateResult => {
    const focusNodeState = form.focusNodes[focusNode.value]
    return html`
      <sh1-focus-node .focusNode="${focusNodeState}">
        ${repeat(focusNodeState.groups, renderGroup(context, focusNodeState))}
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

function renderGroup(context: RenderContext, focusNode: FocusNodeState) {
  return (group: PropertyGroupState): TemplateResult => {
    const properties = focusNode.properties
      .filter(({ hidden }) => !hidden)
      .filter(byGroup(group?.group))
      .filter(onlySingleProperty)
    return html`
      <sh1-group slot="${ifDefined(group.group?.id.value)}" .group="${group}">
        ${repeat(properties, renderProperty(context, focusNode))}
      </sh1-group>`
  }
}

function renderProperty(context: RenderContext, focusNode: FocusNodeState) {
  return (property: PropertyState) => {
    function addObject() {
      context.dispatch.form.addObject({
        focusNode: focusNode.focusNode,
        property: property.shape,
      })
    }

    let addButton = html``
    if (property.canAdd) {
      addButton = html`<sh1-button slot="add-object" @click="${addObject}">
        + ${localizedLabel(property.shape, { property: sh.name })}
      </sh1-button>`
    }

    return html`
      <sh1-property .dispatch="${context.dispatch}" .focusNode="${focusNode}" .property="${property}">
        ${repeat(property.objects, renderObject(context, focusNode, property))}
        ${addButton}
      </sh1-property>`
  }
}

function renderObject(context: RenderContext, focusNode: FocusNodeState, property: PropertyState) {
  return (object: PropertyObjectState) => {
    function removeObject() {
      context.dispatch.form.removeObject({
        focusNode: focusNode.focusNode,
        property: property.shape,
        object,
      })
    }

    return html`
      <sh1-object .dispatch="${context.dispatch}" .focusNode="${focusNode}" .object="${object}" .property="${property}">
        ${renderEditor(context, focusNode, property, object)}
        <sh1-button slot="remove-object" ?hidden="${!property.canRemove}" @click=${removeObject}>×</sh1-button>
      </sh1-object>`
  }
}

function renderEditor(context: RenderContext, focusNode: FocusNodeState, property: PropertyState, object: PropertyObjectState) {
  const { selectedEditor: editor } = object
  if (!editor) {
    return ''
  }

  function focusOnObjectNode() {
    if (object.object?.term.termType === 'NamedNode' || object.object?.term.termType === 'BlankNode') {
      context.dispatch.form.pushFocusNode({ focusNode: object.object as any, property: property.shape })
    }
  }

  const componentBindings = {
    '.property': property,
    '.focusNode': focusNode,
    '.value': object,
    class: 'editor',
  }

  if (editor.equals(dash.DetailsEditor)) {
    const overrideShape = object.overrides?.out(sh.node)
    const detailsShape = isResource(overrideShape)
      ? env().rdfine.sh.NodeShape(overrideShape)
      : property.shape.node

    let focusNodeResult = html``

    if (isResource(object.object)) {
      const focusNodeState = context.state.focusNodes[object.object.value]
      if (!focusNodeState) {
        context.dispatch.form.createFocusNodeState({
          focusNode: object.object,
          shape: detailsShape,
        })
      } else {
        focusNodeResult = html`
          <sh1-focus-node .focusNode="${focusNodeState}">
            ${repeat(focusNodeState.groups, renderGroup(context, focusNodeState))}
          </sh1-focus-node>`
      }
    }

    return html`<dash-details ${spread(componentBindings)} .nodeShape="${detailsShape}">
      ${focusNodeResult}
    </dash-details>`
  }

  return renderComponent(context, editor, componentBindings)
}

function renderComponent(context: RenderContext, editor: NamedNode, data: Record<string, unknown>): TemplateResult {
  let extended: TemplateResult | symbol = nothing

  const component = context.components.components[editor.value]
  if (component?.extends) {
    extended = renderComponent(context, component.extends, {
      ...data,
      class: undefined,
    })
  }

  const tagName = staticLit.literal`${staticLit.unsafeStatic(getEditorTagName(editor))}`
  return staticLit.html`<${tagName} ${spread(data)}>${extended}</${tagName}>`
}
