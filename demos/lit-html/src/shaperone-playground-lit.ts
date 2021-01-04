import { customElement, LitElement, css, property, query } from 'lit-element'
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js'
import '@vaadin/vaadin-menu-bar/vaadin-menu-bar.js'
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js'
import '@vaadin/vaadin-button/vaadin-button.js'
import '@material/mwc-icon/mwc-icon.js'
import type { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import { html, render } from 'lit-html'
import '@hydrofoil/shaperone-wc/shaperone-form'
import '@rdfjs-elements/rdf-editor'
import { connect } from '@captaincodeman/rdx'
import { Quad } from 'rdf-js'
import { store, State, Dispatch } from './state/store'
import { shapeMenu } from './menu/shape'
import { resourceMenu } from './menu/resource'
import { formMenu } from './menu/formMenu'
import { configureRenderer, selectComponents } from './configure'

interface RdfEditor {
  serialized: string
  quads: Quad[]
  codeMirror: {
    value: string
  }
}

@customElement('shaperone-playground-lit')
export class ShaperonePlayground extends connect(store(), LitElement) {
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
    }

    #title {
      flex: 1;
    }

    [slot=navbar] {
      margin-right: 10px;
    }

    shaperone-form::part(property) {
      flex: 1;
      min-width: 250px;
      border: solid 1px black;
      border-radius: 3px;
      margin: 4px;
    }

    shaperone-form::part(property):nth-child(0) {
      flex-basis: 100%;
    }

    shaperone-form::part(focus-node), shaperone-form::part(property-group) {
      display: flex;
      flex-wrap: wrap;
    }`
  }

  @property({ type: Object })
  shape!: State['shape']

  @property({ type: Object })
  playground!: State['playground']

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
  renderer!: State['rendererSettings']

  @property({ type: Boolean })
  noEditorSwitches!: boolean

  async connectedCallback() {
    document.addEventListener('resource-selected', (e: any) => store().dispatch.resource.selectResource({ id: e.detail.value }))
    document.addEventListener('prefixes-changed', (e: any) => store().dispatch.resource.setPrefixes(e.detail.value))
    document.addEventListener('shape-load', (e: any) => store().dispatch.shape.loadShape(e.detail))
    document.addEventListener('generate-instances', (e: any) => store().dispatch.shape.generateInstances())

    super.connectedCallback()

    store().dispatch.playground.restoreState()
  }

  render() {
    return html`<vaadin-app-layout>
      <h2 id="title" slot="navbar">
        <span>@hydrofoil/shaperone playground</span>
      </h2>
      <vaadin-button slot="navbar" @click="${this.__reset}">Reset</vaadin-button>
      <vaadin-button slot="navbar" @click="${this.__share}"><mwc-icon>share</mwc-icon></vaadin-button>
      <a href="https://github.com/hypermedia-app/shaperone" target="_blank" slot="navbar"><img alt="GitHub" src="/_media/GitHub-Mark-32px.png"></a>

      <div class="content">
      <vaadin-split-layout id="top-splitter">
        <div style="width: 33%">
          <vaadin-menu-bar .items="${shapeMenu(this.shape)}" @item-selected="${this.__editorMenuSelected(store().dispatch.shape, this.shapeEditor)}"></vaadin-menu-bar>
          <rdf-editor id="shapeEditor" prefixes="sh,dash"
                     .serialized="${this.shape.serialized}"
                     .format="${this.shape.format}"
                     .quads="${this.shape.quads}"
                     @quads-changed="${this.__setShape}"
                     @serialized="${this.__setSerializedShape}"></rdf-editor>
        </div>

        <vaadin-split-layout style="width: 80%">
          <div>
            <vaadin-menu-bar .items="${formMenu(this.components, this.renderer)}" @item-selected="${this.__formMenuSelected}"></vaadin-menu-bar>
            <shaperone-form id="form"
                           .shapes="${this.shape.pointer}"
                           .resource="${this.resource.pointer}"
                           ?no-editor-switches="${this.noEditorSwitches}"
                           @changed="${this.__saveResource}"></shaperone-form>
          </div>
          <div style="min-width: 50%; max-width: 80%">
            <vaadin-menu-bar .items="${resourceMenu(this.resource)}" @item-selected="${this.__editorMenuSelected(store().dispatch.resource, this.resourceEditor)}"></vaadin-menu-bar>
            <rdf-editor id="resourceEditor" prefixes="${this.resource.prefixes.join(',')}"
                       .serialized="${this.resource.serialized}"
                       .format="${this.resource.format}"
                       .quads="${this.resource.quads}"
                       @quads-changed="${this.__setResource}"
                       @serialized="${this.__setSerializedResource}"></rdf-editor>
          </div>
        </vaadin-split-layout>
      </vaadin-split-layout></div>
    </vaadin-app-layout>

    <vaadin-dialog ?opened="${this.playground.sharePopup}"
                   .renderer="${this.__renderSharingDialog(this)}"
                   @opened-changed="${(e: any) => store().dispatch.playground.hideSharingDialog(!e.target.opened)}">
    </vaadin-dialog>`
  }

  __setShape(e: CustomEvent) {
    store().dispatch.shape.setShapesGraph(e.detail.value)
    store().dispatch.shape.serialized(this.shapeEditor.codeMirror.value)
  }

  __setSerializedShape(e: any) {
    store().dispatch.shape.serialized(e.detail.value)
  }

  __setSerializedResource(e: any) {
    store().dispatch.resource.setSerialized(e.detail.value)
  }

  __setResource(e: CustomEvent) {
    store().dispatch.resource.replaceGraph({ dataset: e.detail.value })
    store().dispatch.resource.setSerialized(this.resourceEditor.codeMirror.value)
  }

  __formMenuSelected(e: CustomEvent) {
    switch (e.detail.value.type) {
      case 'editorChoice':
        store().dispatch.componentsSettings.setEditorChoice(!e.detail.value.checked)
        break
      case 'components':
        store().dispatch.componentsSettings.switchComponents(e.detail.value.text)
        break
      case 'layout':
        store().dispatch.rendererSettings.switchLayout(e.detail.value.id)
        break
      case 'renderer':
        store().dispatch.rendererSettings.switchNesting(e.detail.value.id)
        break
      default:
        break
    }
  }

  __saveResource() {
    if (this.form.value) {
      store().dispatch.resource.replaceGraph({ dataset: this.form.resource?.dataset, updatePointer: false })
    }
  }

  __editorMenuSelected(dispatch: Dispatch['shape'], editor: RdfEditor) {
    return (e: CustomEvent) => {
      switch (e.detail.value.type) {
        case 'format':
          dispatch.format(e.detail.value.text)
          break
        case 'root shape':
          dispatch.selectRootShape(e.detail.value.pointer)
          break
        default:
          dispatch.serialized(editor.codeMirror.value)
          dispatch.setShapesGraph(editor.quads)
          break
      }
    }
  }

  __reset() {
    localStorage.removeItem(document.location.hostname)
    document.location.reload()
  }

  async __share() {
    await Promise.all([import('@vaadin/vaadin-dialog/vaadin-dialog.js'),
      import('@vaadin/vaadin-text-field/vaadin-text-field.js'),
      import('@vaadin/vaadin-checkbox/vaadin-checkbox.js')])
    store().dispatch.playground.showSharingDialog()
  }

  __renderSharingDialog(parent: ShaperonePlayground) {
    return (root: HTMLElement) => {
      let dialogContents: Element
      if (!root.firstElementChild) {
        dialogContents = document.createElement('div')
        root.appendChild(dialogContents)
      } else {
        dialogContents = root.firstElementChild
      }

      render(html`<vaadin-text-field style="width:500px"
                                     readonly autoselect
                                     label="Copy this URL to share playground"
                                    .value="${parent.playground.sharingLink}"></vaadin-text-field>
                  <br>
                  <vaadin-checkbox ?checked="${parent.playground.shareFormSettings}"
                                  @change="${() => store().dispatch.playground.shareFormSettings(!parent.playground.shareFormSettings)}">
                                  Share form settings
                  </vaadin-checkbox>`, dialogContents)

      dialogContents.querySelector('vaadin-text-field')?.focus()
    }
  }

  mapState(state: State) {
    selectComponents(state.componentsSettings.components)
    configureRenderer.switchLayout(state.rendererSettings)
    configureRenderer.switchNesting(state.rendererSettings)

    return {
      components: state.componentsSettings,
      renderer: state.rendererSettings,
      resource: state.resource,
      shape: state.shape,
      playground: state.playground,
      noEditorSwitches: state.componentsSettings.disableEditorChoice,
    }
  }
}
