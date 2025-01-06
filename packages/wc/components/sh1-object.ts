import { css, html, nothing, type TemplateResult } from 'lit'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property.js'
import { property } from 'lit/decorators.js'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { isResource } from 'is-graph-pointer'
import env from '@hydrofoil/shaperone-core/env.js'
import { spread } from '@open-wc/lit-helpers'
import type { NamedNode } from '@rdfjs/types'
import * as staticLit from 'lit/static-html.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'
import { getEditorTagName } from './editor.js'

export class Sh1Object extends ShaperoneElementBase {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `
  }

  @property({ type: Object })
  private object!: PropertyObjectState

  @property({ type: Object })
  private focusNode!: FocusNodeState

  @property({ type: Object })
  private property!: PropertyState

  constructor() {
    super()

    this.addEventListener('value-changed', this.onValueChanged.bind(this))
    this.addEventListener('cleared', this.onCleared.bind(this))
    this.addEventListener('remove-object', this.onRemoved.bind(this))
    this.addEventListener('editor-selected', this.onEditorSelected.bind(this))
  }

  private onRemoved() {
    this.dispatch?.form.removeObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
    })
  }

  private onEditorSelected({ detail: { editor } }: HTMLElementEventMap['editor-selected']) {
    this.dispatch?.form.selectEditor({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
      editor,
    })
  }

  private onCleared() {
    this.dispatch?.form.clearValue({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
    })
  }

  private onValueChanged(e: HTMLElementEventMap['value-changed']) {
    const value = typeof e.detail.value === 'string'
      ? createTerm(this.property, e.detail.value)
      : e.detail.value

    this.dispatch?.form.updateObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
      newValue: value,
    })

    e.stopPropagation()
  }

  render() {
    if (!this.object || !this.property || !this.focusNode) {
      return ''
    }

    return html`
      ${this.renderEditor()}
      <sh1-button kind="remove-object"
                  ?hidden="${!this.property.canRemove}"
                  click="remove-object">×</sh1-button>
    `
  }

  renderEditor() {
    const { selectedEditor: editor } = this.object
    if (!editor) {
      return ''
    }

    const componentBindings = {
      '.property': this.property,
      '.focusNode': this.focusNode,
      '.value': this.object,
      class: 'editor',
    }

    if (editor.equals(dash.DetailsEditor)) {
      const overrideShape = this.object.overrides?.out(sh.node)
      const detailsShape = isResource(overrideShape)
        ? env().rdfine.sh.NodeShape(overrideShape)
        : this.property.shape.node

      let focusNodeState: FocusNodeState | undefined
      if (this.object.object) {
        focusNodeState = this.form!.state.focusNodes[this.object.object.value]
      }

      return html`<dash-details ${spread(componentBindings)} .nodeShape="${detailsShape}">
        <sh1-focus-node .focusNode="${focusNodeState}">
        </sh1-focus-node>
      </dash-details>`
    }

    return this.renderComponent(editor, componentBindings)
  }

  renderComponent(editor: NamedNode, data: Record<string, unknown>): TemplateResult {
    let extended: TemplateResult | symbol = nothing

    const component = this.form!.components.components[editor.value]
    if (component?.extends) {
      extended = this.renderComponent(component.extends, {
        ...data,
        class: undefined,
      })
    }

    const tagName = staticLit.literal`${staticLit.unsafeStatic(getEditorTagName(editor))}`
    return staticLit.html`<${tagName} ${spread(data)}>${extended}</${tagName}>`
  }
}
