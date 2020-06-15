import { LitElement, customElement, property, css, html } from 'lit-element'
import type { SingleContextClownface } from 'clownface'
import { BlankNode, NamedNode, DatasetCore } from 'rdf-js'
import { Shape } from '@rdfine/shacl'
import type { FormState } from '@hydrofoil/shaperone-core/state'
import type { FocusNode, initialState } from '@hydrofoil/shaperone-core'
import { DefaultRenderer, Renderer } from './renderer'
import { stateEvent } from '@captaincodeman/rdx'
import { ensureEventTarget } from './lib/eventTarget'

const store: unique symbol = Symbol('form state store')
const onStateChange: unique symbol = Symbol('form state store')

@customElement('shaperone-form')
export class ShaperoneForm extends LitElement {
  private[store]: ReturnType<typeof initialState>

  static get styles() {
    return [css`
      :host {
        display: block
      }`]
  }

  static renderer: Renderer = DefaultRenderer

  public constructor() {
    super()
    this[onStateChange] = this[onStateChange].bind(this)
  }

  async connectedCallback() {
    await ensureEventTarget()

    const { initialState } = await import('@hydrofoil/shaperone-core')

    this[store] = initialState()
    this[store].addEventListener(stateEvent, this[onStateChange])

    if (this.__shape) {
      this[store].dispatch.datasets.updateShape(this.__shape)
    }
    if (this.__resource) {
      this[store].dispatch.datasets.updateResource(this.__resource)
    }

    super.connectedCallback()
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

  set resource(value: FocusNode) {
    this.__resource = value
    if (this[store]) {
      this[store].dispatch.datasets.updateResource(value)
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

  set shape(shape: SingleContextClownface<NamedNode | BlankNode> | Shape) {
    this.__shape = shape
    if (this[store]) {
      this[store].dispatch.datasets.updateShape(shape)
    }
  }

  render() {
    if (!ShaperoneForm.renderer.ready) {
      ShaperoneForm.renderer.loadDependencies().then(() => this.requestUpdate())

      return ShaperoneForm.renderer.strategy.initialising()
    }

    return html`<style>${ShaperoneForm.renderer.styles}</style> ${ShaperoneForm.renderer.render({
      state: this.state,
      actions: this[store].dispatch.form,
    })}`
  }

  private [onStateChange]() {
    this.state = this[store].state.form
  }
}
