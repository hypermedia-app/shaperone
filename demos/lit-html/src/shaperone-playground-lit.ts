import { customElement, LitElement, css, property, query } from 'lit-element'
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js'
import '@vaadin/vaadin-menu-bar/vaadin-menu-bar.js'
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js'
import { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import './shaperone-turtle-editor'
import type { ShaperoneTurtleEditor } from './shaperone-turtle-editor'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import { store, State } from './state/store'
import { connect } from '@captaincodeman/rdx'

const saveResource = Symbol('save resource')

const shapeMenu = [
  {
    text: 'Update form',
  },
]

const resourceMenu = [
  {
    text: 'Update form',
  },
]

ShaperoneForm.renderer.strategy = {
  ...ShaperoneForm.renderer.strategy,
  ...MaterialRenderStrategy,
}

@customElement('shaperone-playground-lit')
export class ShaperonePlayground extends connect(store, LitElement) {
  static get styles() {
    return css`:host {
      height: 100vh;
      display: block;
    }

    .content {
      height: 100%;
      display: flex;
    }

    #top-splitter {
      flex: 1;
    }

    vaadin-menu-bar {
      position: sticky;
      position: -webkit-sticky;
      z-index: 100;
      top: 0;
      background: white;
    }`
  }

  @property({ type: Object })
  shape!: State['shape']

  @property({ type: Object })
  resource!: State['resource']

  @query('#shapeEditor')
  shapeEditor!: ShaperoneTurtleEditor

  @query('#resourceEditor')
  resourceEditor!: ShaperoneTurtleEditor

  @query('#form')
  form!: ShaperoneForm

  @property({ type: Object })
  components!: State['components']

  @property({ type: Object })
  layout!: State['layout']

  get formMenu() {
    return [
      {
        text: '"Save" resource',
        id: saveResource,
      },
      this.components,
      this.layout,
    ]
  }

  async connectedCallback() {
    super.connectedCallback()

    store.dispatch.resource.parse()
    store.dispatch.shape.parse()
  }

  render() {
    return html`<vaadin-app-layout>
      <h2 slot="navbar">@hydrofoil/shaperone playground</h2>
      <div class="content">
      <vaadin-split-layout id="top-splitter">
        <div style="width: 33%">
          <vaadin-menu-bar .items="${shapeMenu}" @item-selected="${this.__setShape}"></vaadin-menu-bar>
          <shaperone-turtle-editor id="shapeEditor" .value="${this.shape.triples}"></shaperone-turtle-editor>
        </div>

        <vaadin-split-layout style="width: 67%">
          <div>
            <vaadin-menu-bar .items="${this.formMenu}" @item-selected="${this.__formMenuSelected}"></vaadin-menu-bar>
            <shaperone-form id="form" .shape="${this.shape.pointer}" .resource="${this.resource.pointer}"></shaperone-form>
          </div>
          <div style="max-width: 50%">
            <vaadin-menu-bar .items="${resourceMenu}" @item-selected="${this.__parseResource}"></vaadin-menu-bar>
            <shaperone-turtle-editor id="resourceEditor" .value="${this.resource.triples}"></shaperone-turtle-editor>
          </div>
        </vaadin-split-layout>
      </vaadin-split-layout></div>
    </vaadin-app-layout>`
  }

  __formMenuSelected(e: CustomEvent) {
    if (e.detail.value.type === 'components') {
      store.dispatch.components.switchComponents({ name: e.detail.value.text })
    } else if (e.detail.value.id === saveResource) {
      store.dispatch.resource.serialize(this.form.value)
    }
  }

  __parseResource() {
    store.dispatch.resource.parse(this.resourceEditor.value)
  }

  async __setShape() {
    store.dispatch.shape.parse(this.shapeEditor.value)
  }

  mapState(state: State) {
    ShaperoneForm.renderer.components.clear()
    ShaperoneForm.renderer.components.addModule(state.components.selected)

    return {
      components: state.components,
      layout: state.layout,
      resource: state.resource,
      shape: state.shape,
    }
  }
}
