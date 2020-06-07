import { LitElement, customElement, property, css } from 'lit-element'
import type { SingleContextClownface } from 'clownface'
import { BlankNode, NamedNode, DatasetCore } from 'rdf-js'
import { Shape } from '@rdfine/shacl'
import { FormState } from '@hydrofoil/shaperone-core/state'
import { initialState } from '@hydrofoil/shaperone-core'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import { connectEx } from './lib/connectEx'
import { DefaultRenderer, Renderer } from './renderer'

@customElement('shaperone-form')
export class ShaperoneForm extends connectEx(initialState, LitElement) {
  static get styles() {
    return [css`
      :host {
        display: block
      }`, this.renderer.styles]
  }

  static renderer: Renderer = DefaultRenderer

  @property({ type: Object })
  formState!: FormState

  __resource!: FocusNode

  @property({ type: Object })
  get resource(): FocusNode {
    return this.__resource
  }

  set resource(value: FocusNode) {
    this.__resource = value
    this.__initialize()
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
    this.__initialize()
  }

  mapState(state: any) {
    return {
      formState: state.form,
    }
  }

  render() {
    if (!ShaperoneForm.renderer.ready) {
      ShaperoneForm.renderer.loadDependencies().then(() => this.requestUpdate())

      return ShaperoneForm.renderer.strategy.initialising()
    }

    return ShaperoneForm.renderer.render({
      state: this.formState,
      focusNode: this.resource,
      actions: this.store.dispatch.form,
    })
  }

  __initialize() {
    if (!this.shape || !this.resource) return

    this.store.dispatch.form.initAsync({
      shape: this.shape,
      focusNode: this.resource,
    })
  }
}
