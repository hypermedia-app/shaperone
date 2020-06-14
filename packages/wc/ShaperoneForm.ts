import { LitElement, customElement, property, css, html } from 'lit-element'
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
      }`]
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
    this.store.dispatch.datasets.updateResource(value)
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
    this.store.dispatch.datasets.updateShape(shape)
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

    return html`<style>${ShaperoneForm.renderer.styles}</style> ${ShaperoneForm.renderer.render({
      state: this.formState,
      actions: this.store.dispatch.form,
    })}`
  }
}
