import { customElement, LitElement, css, property, query } from 'lit-element'
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js'
import '@vaadin/vaadin-menu-bar/vaadin-menu-bar.js'
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js'
import type { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import './shaperone-turtle-editor'
import { connect } from '@captaincodeman/rdx'
import type { ShaperoneTurtleEditor } from './shaperone-turtle-editor'
import { store, State, Dispatch } from './state/store'

const saveResource = Symbol('save resource')

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
  components!: State['componentsSettings']

  @property({ type: Object })
  rendererMenu!: State['rendererSettings']['menu']

  get formMenu() {
    return [
      {
        text: '"Save" resource',
        id: saveResource,
      },
      this.components,
      ...this.rendererMenu,
    ]
  }

  get resourceMenu() {
    return [
      {
        text: 'Update form',
      },
      ...this.resource.menu,
    ]
  }

  get shapeMenu() {
    return [
      {
        text: 'Update form',
      },
      this.shape.menu,
    ]
  }

  private get __serializeParams() {
    const focusNode = this.form.state.focusNodes[this.form.state.focusStack[0].value]
    const { shape } = focusNode

    return {
      dataset: this.form.value,
      shape,
    }
  }

  async connectedCallback() {
    document.addEventListener('resource-selected', (e: any) => store.dispatch.resource.selectResource({ id: e.detail.value }))

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
          <vaadin-menu-bar .items="${this.shapeMenu}" @item-selected="${this.__editorMenuSelected(store.dispatch.shape, this.shapeEditor)}"></vaadin-menu-bar>
          <shaperone-turtle-editor id="shapeEditor" .value="${this.shape.serialized}" .format="${this.shape.format}"></shaperone-turtle-editor>
        </div>

        <vaadin-split-layout style="width: 67%">
          <div>
            <vaadin-menu-bar .items="${this.formMenu}" @item-selected="${this.__formMenuSelected}"></vaadin-menu-bar>
            <shaperone-form id="form" .shapes="${this.shape.dataset}" .resource="${this.resource.pointer}"></shaperone-form>
          </div>
          <div style="max-width: 50%">
            <vaadin-menu-bar .items="${this.resourceMenu}" @item-selected="${this.__editorMenuSelected(store.dispatch.resource, this.resourceEditor)}"></vaadin-menu-bar>
            <shaperone-turtle-editor id="resourceEditor" .value="${this.resource.serialized}" .format="${this.resource.format}"></shaperone-turtle-editor>
          </div>
        </vaadin-split-layout>
      </vaadin-split-layout></div>
    </vaadin-app-layout>`
  }

  __formMenuSelected(e: CustomEvent) {
    switch (e.detail.value.type) {
      case 'components':
        store.dispatch.componentsSettings.switchComponents(e.detail.value)
        break
      case 'layout':
        store.dispatch.rendererSettings.switchLayout(e.detail.value)
        break
      case 'renderer':
        store.dispatch.rendererSettings.switchNesting(e.detail.value)
        break
      default: {
        const { dataset, shape } = this.__serializeParams
        if (dataset && shape) {
          store.dispatch.resource.serialize({ dataset, shape })
        } }
        break
    }
  }

  __editorMenuSelected(dispatch: Dispatch['shape'] | Dispatch['resource'], editor: ShaperoneTurtleEditor) {
    return (e: CustomEvent) => {
      switch (e.detail.value.type) {
        case 'format': {
          const { shape } = this.__serializeParams
          dispatch.serialized(editor.value)
          dispatch.changeFormat({
            format: e.detail.value,
            shape,
          })
        } break
        default:
          dispatch.serialized(editor.value)
          dispatch.parse()
          break
      }
    }
  }

  mapState(state: State) {
    return {
      components: state.componentsSettings,
      rendererMenu: state.rendererSettings.menu,
      resource: state.resource,
      shape: state.shape,
    }
  }
}
