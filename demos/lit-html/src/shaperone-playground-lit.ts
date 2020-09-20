import { customElement, LitElement, css, property, query } from 'lit-element'
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js'
import '@vaadin/vaadin-menu-bar/vaadin-menu-bar.js'
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js'
import type { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import '@rdfjs-elements/rdf-editor'
import { connect } from '@captaincodeman/rdx'
import { Quad } from 'rdf-js'
import { store, State } from './state/store'

const saveResource = Symbol('save resource')

interface RdfEditor {
  serialized: string
  quads: Quad[]
  codeMirror: {
    value: string
  }
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
    }

    rdf-editor {
      height: 100%;
    }`
  }

  @property({ type: Object })
  shape!: State['shape']

  @property({ type: Object })
  resource!: State['resource']

  @query('#shapeEditor')
  shapeEditor!: RdfEditor

  @query('#resourceEditor')
  resourceEditor!: RdfEditor

  @query('#form')
  form!: ShaperoneForm

  @property({ type: Object })
  components!: State['componentsSettings']

  @property({ type: Object })
  rendererMenu!: State['rendererSettings']['menu']

  __resourceVersion = 1

  get formMenu() {
    return [
      {
        text: '"Save" graph',
        id: saveResource,
      },
      this.components,
      ...this.rendererMenu,
    ]
  }

  async connectedCallback() {
    document.addEventListener('resource-selected', (e: any) => store.dispatch.resource.selectResource({ id: e.detail.value }))
    document.addEventListener('prefixes-changed', (e: any) => store.dispatch.resource.setPrefixes(e.detail.value))

    super.connectedCallback()
  }

  render() {
    let quads = this.resourceEditor?.quads
    if (!quads || this.resource.version > this.__resourceVersion) {
      this.__resourceVersion = this.resource.version
      quads = [...this.resource.pointer.dataset]
    }

    return html`<vaadin-app-layout>
      <h2 slot="navbar">@hydrofoil/shaperone playground</h2>
      <div class="content">
      <vaadin-split-layout id="top-splitter">
        <div style="width: 33%">
          <vaadin-menu-bar .items="${[this.shape.menu]}" @item-selected="${this.__editorMenuSelected(store.dispatch.shape, this.shapeEditor)}"></vaadin-menu-bar>
          <rdf-editor id="shapeEditor" prefixes="sh,dash"
                     .serialized="${this.shape.serialized}"
                     .format="${this.shape.format}"
                     @quads-changed="${this.__setShape}"></rdf-editor>
        </div>

        <vaadin-split-layout style="width: 67%">
          <div>
            <vaadin-menu-bar .items="${this.formMenu}" @item-selected="${this.__formMenuSelected}"></vaadin-menu-bar>
            <shaperone-form id="form" .shapes="${this.shape.dataset}" .resource="${this.resource.pointer}"></shaperone-form>
          </div>
          <div style="max-width: 50%">
            <vaadin-menu-bar .items="${this.resource.menu}" @item-selected="${this.__editorMenuSelected(store.dispatch.resource, this.resourceEditor)}"></vaadin-menu-bar>
            <rdf-editor id="resourceEditor" prefixes="${this.resource.prefixes}"
                       .format="${this.resource.format}"
                       .quads="${quads}"
                       @quads-changed="${this.__setResource}"></rdf-editor>
          </div>
        </vaadin-split-layout>
      </vaadin-split-layout></div>
    </vaadin-app-layout>`
  }

  __setShape(e: CustomEvent) {
    store.dispatch.shape.setShape(e.detail.value)
  }

  __setResource(e: CustomEvent) {
    store.dispatch.resource.replaceGraph({ dataset: e.detail.value, newVersion: false })
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
      default:
        if (this.form.value) {
          store.dispatch.resource.replaceGraph({ dataset: this.form.value, newVersion: true })
        }
        break
    }
  }

  __editorMenuSelected(dispatch: any, editor: RdfEditor) {
    return (e: CustomEvent) => {
      switch (e.detail.value.type) {
        case 'format':
          dispatch.format(e.detail.value.text)
          break
        default:
          dispatch.serialized(editor.codeMirror.value)
          dispatch.setShape(editor.quads)
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
