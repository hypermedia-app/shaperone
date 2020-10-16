import { LitElement, customElement, property, css, html } from 'lit-element'
import { DatasetCore } from 'rdf-js'
import type { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { FocusNode, loadMixins } from '@hydrofoil/shaperone-core'
import { connect } from '@captaincodeman/rdx'
import type { AnyPointer } from 'clownface'
import { ensureEventTarget } from './lib/eventTarget'
import { store, State } from './store'
import type { Renderer } from './renderer'
import { DefaultRenderer } from './DefaultRenderer'
import * as NativeComponents from './NativeComponents'

store.dispatch.components.pushComponents(NativeComponents)

const resourceSymbol: unique symbol = Symbol('resource')
const shapesSymbol: unique symbol = Symbol('shapes')

@customElement('shaperone-form')
export class ShaperoneForm extends connect(store, LitElement) {
  private [resourceSymbol]?: FocusNode
  private [shapesSymbol]?: AnyPointer | DatasetCore | undefined

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

    this.resource = this[resourceSymbol]
    this.shapes = this[shapesSymbol]
  }

  disconnectedCallback() {
    store.dispatch.forms.disconnect(this)
    super.disconnectedCallback()
  }

  @property({ type: Object })
  state!: FormState

  get resource(): FocusNode | undefined {
    return this[resourceSymbol]
  }

  set resource(rootPointer: FocusNode | undefined) {
    if (!rootPointer) return

    this[resourceSymbol] = rootPointer
    store.dispatch.forms.setRootResource({ form: this, rootPointer })
  }

  get value(): DatasetCore | undefined {
    return this.state.resourceGraph
  }

  get shapes(): AnyPointer | DatasetCore | undefined {
    return this[shapesSymbol]
  }

  set shapes(shapesGraph: AnyPointer | DatasetCore | undefined) {
    if (!shapesGraph) return

    this[shapesSymbol] = shapesGraph
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
