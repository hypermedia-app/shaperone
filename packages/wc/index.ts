import { repeat } from 'lit-html/directives/repeat'
import { LitElement, customElement, property, html, css } from 'lit-element'
import type { SingleContextClownface } from 'clownface'
import { BlankNode, NamedNode, DatasetCore, Term } from 'rdf-js'
import { Shape } from '@rdfine/shacl'
import {
  FormState,
  EditorChoice,
  PropertyGroupState,
  PropertyObjectState,
  PropertyState,
} from '@hydrofoil/shaperone-core/lib/FormState'
import { initialState, FocusNode } from '@hydrofoil/shaperone-core'

import '@material/mwc-menu/mwc-menu'
import '@material/mwc-icon/mwc-icon'
import '@material/mwc-list/mwc-list'
import '@material/mwc-list/mwc-list-item'
import 'wc-menu-button'
import { connectEx } from './lib/connectEx'
import { EditorMap } from './lib/components'

@customElement('shaperone-form')
export class ShaperoneForm extends connectEx(initialState, LitElement) {
  static get styles() {
    return css`
      mwc-list-item {
        --mdc-ripple-color: transparent;
        overflow: visible;
      }

      wc-menu-button {
        width: 24px;
      }`
  }

  static components: EditorMap = new EditorMap()

  @property({ type: Object })
  formState!: FormState

  @property({ type: Object })
  resource!: FocusNode

  get value(): DatasetCore {
    return this.resource.dataset
  }

  __shape?: SingleContextClownface<NamedNode | BlankNode> | Shape

  @property({ type: Object })
  get shape(): SingleContextClownface<NamedNode | BlankNode> | Shape | undefined {
    return this.__shape
  }

  set shape(shape: SingleContextClownface<NamedNode | BlankNode> | Shape | undefined) {
    this.__shape = shape
    this.__initialize()
  }

  mapState(state: any) {
    return {
      formState: state.form,
    }
  }

  render() {
    return html`${repeat(Object.values(this.formState.focusNodes[this.resource.value].groups), this._renderGroup.bind(this))}`
  }

  _renderGroup(group: PropertyGroupState) {
    return html`${repeat(Object.values(group.properties), this._renderProperty.bind(this))}`
  }

  _renderProperty(property: PropertyState) {
    let addRow = html``

    if (!property.maxReached) {
      addRow = html`<mwc-list-item hasmeta>
          <mwc-icon slot="meta" @click="${this.__addObject(property).bind(this)}">add_circle</mwc-icon>
        </mwc-list-item>`
    }

    return html`<mwc-list>
        <mwc-list-item noninteractive>${property.name}</mwc-list-item>
        ${repeat(property.objects, (value, index) => html`
          <mwc-list-item hasmeta style="display: flex">
            ${this._renderEditor(property, value)}
            <div slot="meta">
              <wc-menu-button id="toggle-${property.shape.id.value}-${index}" @opened="${this.__open(property, index)}" @closed="${this.__close(property, index)}"></wc-menu-button>
              <mwc-menu quick id="menu-${property.shape.id.value}-${index}" @closed="${this.__closeButton(property, index)}">
                ${repeat(value.editors, this.__renderEditorSelector(property, value).bind(this))}
                <mwc-list-item @click="${this.__removeObject(property, value)}">Remove</mwc-list-item>
              </mwc-menu>
            </div>
          </mwc-list-item>
        `)}
        ${addRow}
      </mwc-list>`
  }

  __renderEditorSelector(property: PropertyState, value: PropertyObjectState) {
    return function (this: ShaperoneForm, choice: EditorChoice) {
      return html`<mwc-list-item @click="${this.__switchEditor(property, value, choice).bind(this)}">${choice.editor.value}</mwc-list-item>`
    }
  }

  __switchEditor(property: PropertyState, value: PropertyObjectState, choice: EditorChoice) {
    return function (this: ShaperoneForm) {
      this.store.dispatch.form.selectEditor({
        focusNode: this.resource,
        property,
        value: value.object.term,
        editor: choice.editor,
      })
    }
  }

  __addObject(property: PropertyState) {
    return function (this: ShaperoneForm) {
      this.store.dispatch.form.addObject({ focusNode: this.resource, property })
    }
  }

  __removeObject(property: PropertyState, value: PropertyObjectState) {
    return () => {
      this.store.dispatch.form.removeObject({ focusNode: this.resource, property, object: value })
    }
  }

  __closeButton(property: PropertyState, i: number) {
    return function (this: ShaperoneForm) {
      this.renderRoot.querySelector(`#toggle-${property.shape.id.value}-${i}`).open = false
    }.bind(this)
  }

  __open(property: PropertyState, i: number) {
    return function (this: ShaperoneForm) {
      this.renderRoot.querySelector(`#menu-${property.shape.id.value}-${i}`)?.show()
    }.bind(this)
  }

  __close(property: PropertyState, i: number) {
    return function (this: ShaperoneForm) {
      this.renderRoot.querySelector(`#menu-${property.shape.id.value}-${i}`)?.close()
    }.bind(this)
  }

  _renderEditor(property: PropertyState, value: PropertyObjectState) {
    const componentFactory = ShaperoneForm.components.get(value.selectedEditor)
    if (!componentFactory) {
      return html`No editor found for property`
    }

    return componentFactory({
      property,
      value,
      update: this.__updateValue(property, value).bind(this),
    })
  }

  __updateValue(property: PropertyState, value: PropertyObjectState) {
    return function (this: ShaperoneForm, newValue: Term) {
      this.store.dispatch.form.updateObject({
        focusNode: this.resource,
        property,
        oldValue: value.object.term,
        newValue,
      })
    }
  }

  __initialize() {
    if (!this.shape || !this.resource) return

    this.store.dispatch.form.initAsync({
      shape: this.shape,
      focusNode: this.resource,
    })
  }
}
