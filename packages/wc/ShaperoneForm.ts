import { LitElement, customElement, property, css, html } from 'lit-element'
import { DatasetCore } from 'rdf-js'
import type { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { FocusNode, loadMixins } from '@hydrofoil/shaperone-core'
import { connect } from '@captaincodeman/rdx'
import { ensureEventTarget } from './lib/eventTarget'
import { store, State } from './store'
import { Renderer } from './renderer'
import { DefaultRenderer } from './DefaultRenderer'
import * as NativeComponents from './NativeComponents'

store.dispatch.components.pushComponents(NativeComponents)

@customElement('shaperone-form')
export class ShaperoneForm extends connect(store, LitElement) {
  static get styles() {
    return [css`
      :host {
        display: block
      }`]
  }

  renderer: Renderer = DefaultRenderer

  @property({ type: Object })
  editors!: State['editors']

  @property({ type: Object })
  components!: State['components']

  @property({ type: Object })
  rendererOptions!: State['renderer']

  async connectedCallback() {
    await ensureEventTarget()
    await loadMixins()

    store.dispatch.editors.loadDash()
    store.dispatch.forms.connect(this)

    super.connectedCallback()
  }

  disconnectedCallback() {
    store.dispatch.forms.disconnect(this)
    super.disconnectedCallback()
  }

  @property({ type: Object })
  state!: FormState

  set resource(rootPointer: FocusNode | undefined) {
    if (!rootPointer) return

    store.dispatch.forms.setRootResource({ form: this, rootPointer })
  }

  get value(): DatasetCore | undefined {
    return this.state.resourceGraph
  }

  set shapes(shapesGraph: DatasetCore | undefined) {
    if (!shapesGraph) return

    store.dispatch.forms.setShapesGraph({
      form: this,
      shapesGraph,
    })
  }

  render() {
    if (!this.rendererOptions.ready) {
      store.dispatch.renderer.loadDependencies()

      return this.rendererOptions.strategy.initialising()
    }

    return html`<style>${this.rendererOptions.styles}</style> ${this.renderer.render({
      form: this,
      state: this.state,
      components: this.components,
      actions: store.dispatch,
      strategy: this.rendererOptions.strategy,
    })}`
  }

  mapState(state: State) {
    return {
      state: state.forms.instances.get(this),
      rendererOptions: state.renderer,
      editors: state.editors,
      components: state.components,
    }
  }
}
