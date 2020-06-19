import { LitElement, customElement, property, css, html } from 'lit-element'
import type { SingleContextClownface } from 'clownface'
import { BlankNode, NamedNode, DatasetCore } from 'rdf-js'
import { Shape } from '@rdfine/shacl'
import type { FormState } from '@hydrofoil/shaperone-core/state/form'
import type { FocusNode, createInstanceState } from '@hydrofoil/shaperone-core'
import { connect, stateEvent } from '@captaincodeman/rdx'
import { ensureEventTarget } from './lib/eventTarget'
import { store, State } from './store'
import { Renderer } from './renderer'
import { DefaultRenderer } from './DefaultRenderer'
import * as NativeComponents from './NativeComponents'

const storeSymbol: unique symbol = Symbol('form state store')
const onStateChange: unique symbol = Symbol('form state store')

store.dispatch.components.pushComponents(NativeComponents)

@customElement('shaperone-form')
export class ShaperoneForm extends connect(store, LitElement) {
  private[storeSymbol]: ReturnType<typeof createInstanceState>

  static get styles() {
    return [css`
      :host {
        display: block
      }`]
  }

  renderer: Renderer = DefaultRenderer

  @property({ type: Object })
  configuration!: State

  public constructor() {
    super()
    this[onStateChange] = this[onStateChange].bind(this)
  }

  async connectedCallback() {
    await ensureEventTarget()

    const { createInstanceState } = await import('@hydrofoil/shaperone-core')

    this[storeSymbol] = createInstanceState()
    this[storeSymbol].addEventListener(stateEvent, this[onStateChange])

    store.dispatch.editors.loadDash()

    await super.connectedCallback()

    if (this.__shape) {
      this[storeSymbol].dispatch.datasets.updateShape({
        shapeOrPointer: this.__shape,
        editors: this.configuration.editors,
      })
    }
    if (this.__resource) {
      this[storeSymbol].dispatch.datasets.updateResource({
        focusNode: this.__resource,
        editors: this.configuration.editors,
      })
    }
  }

  disconnectedCallback(): void {
    this.removeEventListener(stateEvent, this[onStateChange])
    super.disconnectedCallback()
  }

  @property({ type: Object })
  state!: FormState

  __resource!: FocusNode

  @property({ type: Object })
  get resource(): FocusNode {
    return this.__resource
  }

  set resource(focusNode: FocusNode) {
    this.__resource = focusNode
    if (this[storeSymbol]) {
      this[storeSymbol].dispatch.datasets.updateResource({ focusNode, editors: this.configuration.editors })
    }
  }

  get value(): DatasetCore {
    return this.resource.dataset
  }

  __shape!: SingleContextClownface<NamedNode | BlankNode> | Shape

  @property({ type: Object })
  get shape(): SingleContextClownface<NamedNode | BlankNode> | Shape {
    return this.__shape
  }

  set shape(shapeOrPointer: SingleContextClownface<NamedNode | BlankNode> | Shape) {
    this.__shape = shapeOrPointer
    if (this[storeSymbol]) {
      this[storeSymbol].dispatch.datasets.updateShape({
        shapeOrPointer,
        editors: this.configuration.editors,
      })
    }
  }

  render() {
    if (!this.configuration.renderer.ready) {
      store.dispatch.renderer.loadDependencies()

      return this.configuration.renderer.strategy.initialising()
    }

    return html`<style>${this.configuration.renderer.styles}</style> ${this.renderer.render({
      form: this.state,
      state: this.configuration,
      actions: { ...this[storeSymbol].dispatch, ...store.dispatch },
    })}`
  }

  mapState(configuration: State) {
    return { configuration }
  }

  private [onStateChange]() {
    this.state = this[storeSymbol].state.form
  }
}
