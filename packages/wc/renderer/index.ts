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
  PropertyGroupState,
  PropertyObjectState,
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
import type { Dispatch } from '../store.js'

export default class implements Renderer<TemplateResult> {
  constructor(private readonly dispatch: Dispatch) {
    // no-op
  }

  render(context: RenderContext): TemplateResult {
    const { editors, state, components } = context

    if (!editors || !state || !components) {
      return html``
    }

    return html`
      <sh1-form .dispatch="${this.dispatch}">
        ${repeat(context.state.focusStack, this.renderFocusNode(context, context.state))}
      </sh1-form>`
  }

  renderFocusNode(context: RenderContext, form: FormState) {
    return (focusNode: FocusNode): TemplateResult => {
      const focusNodeState = form.focusNodes[focusNode.value]
      return html`
      <sh1-focus-node .dispatch="${this.dispatch}" .focusNode="${focusNodeState}">
        ${repeat(focusNodeState.groups, this.renderGroup(context, focusNodeState))}
      </sh1-focus-node>`
    }
  }

  renderGroup(context: RenderContext, focusNode: FocusNodeState) {
    return (group: PropertyGroupState): TemplateResult => {
      const properties = focusNode.properties
        .filter(({ hidden }) => !hidden)
        .filter(byGroup(group?.group))
        .filter(onlySingleProperty)
      return html`
      <sh1-group .dispatch="${this.dispatch}" slot="${ifDefined(group.group?.id.value)}" .group="${group}">
        ${repeat(properties, this.renderProperty(context, focusNode))}
      </sh1-group>`
    }
  }

  renderProperty(context: RenderContext, focusNode: FocusNodeState) {
    return (property: PropertyState) => {
      let addButton = html``
      if (property.canAdd) {
        addButton = html`<sh1-button slot="add-object" kind="add-object">
        + ${localizedLabel(property.shape, { property: sh.name })}
      </sh1-button>`
      }

      return html`
      <sh1-property can-add="${property.canAdd}" .dispatch="${this.dispatch}" .focusNode="${focusNode}" .property="${property}">
        ${repeat(property.objects, this.renderObject(context, focusNode, property))}
        ${addButton}
      </sh1-property>`
    }
  }

  renderObject(context: RenderContext, focusNode: FocusNodeState, property: PropertyState) {
    return (object: PropertyObjectState) => html`
      <sh1-object .dispatch="${this.dispatch}" .focusNode="${focusNode}" .object="${object}" .property="${property}">
        ${this.renderEditor(context, focusNode, property, object)}
        <sh1-button slot="remove-object" kind="remove-object" ?hidden="${!property.canRemove}" click="remove-object">×</sh1-button>
      </sh1-object>`
  }

  renderEditor(context: RenderContext, focusNode: FocusNodeState, property: PropertyState, object: PropertyObjectState) {
    const { selectedEditor: editor } = object
    if (!editor) {
      return ''
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

      let focusNodeState: FocusNodeState | undefined
      if (object.object) {
        focusNodeState = context.state.focusNodes[object.object.value]
      }

      return html`<dash-details ${spread(componentBindings)} .nodeShape="${detailsShape}">
        <sh1-focus-node .dispatch="${this.dispatch}" .focusNode="${focusNodeState}">
          ${focusNodeState ? repeat(focusNodeState.groups, this.renderGroup(context, focusNodeState)) : ''}
        </sh1-focus-node>
      </dash-details>`
    }

    return this.renderComponent(context, editor, componentBindings)
  }

  renderComponent(context: RenderContext, editor: NamedNode, data: Record<string, unknown>): TemplateResult {
    let extended: TemplateResult | symbol = nothing

    const component = context.components.components[editor.value]
    if (component?.extends) {
      extended = this.renderComponent(context, component.extends, {
        ...data,
        class: undefined,
      })
    }

    const tagName = staticLit.literal`${staticLit.unsafeStatic(getEditorTagName(editor))}`
    return staticLit.html`<${tagName} ${spread(data)}>${extended}</${tagName}>`
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
