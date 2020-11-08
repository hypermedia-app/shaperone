import { LitElement, customElement, property, css, html, PropertyValues } from 'lit-element'
import { DatasetCore } from 'rdf-js'
import type { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { FocusNode, loadMixins } from '@hydrofoil/shaperone-core'
import { connect } from '@captaincodeman/rdx'
import type { AnyPointer, GraphPointer } from 'clownface'
import { NodeShape } from '@rdfine/shacl'
import { ensureEventTarget } from './lib/eventTarget'
import { store, State } from './store'
import type { Renderer } from './renderer'
import { DefaultRenderer } from './DefaultRenderer'
import * as NativeComponents from './NativeComponents'

store().dispatch.components.pushComponents(NativeComponents)

const resourceSymbol: unique symbol = Symbol('resource')
const shapesSymbol: unique symbol = Symbol('shapes dataset')
const notify: unique symbol = Symbol('notify')
const shapes: unique symbol = Symbol('shapes')

export const id: (form: any) => symbol = (() => {
  const map = new WeakMap<any, symbol>()
  let nextId = 1

  return (form: ShaperoneForm) => {
    let thisId = map.get(form)

    if (!thisId) {
      thisId = Symbol(`${form.id || 'form'}-${nextId}`)
      map.set(form, thisId)
      nextId += 1
    }

    return thisId
  }
})()

@customElement('shaperone-form')
export class ShaperoneForm extends connect(store(), LitElement) {
  private [resourceSymbol]?: GraphPointer<FocusNode>
  private [shapesSymbol]?: AnyPointer | DatasetCore | undefined
  private [notify]: (detail: any) => void

  static get styles() {
    return [css`
      :host {
        display: block
      }`]
  }

  renderer: Renderer = DefaultRenderer

  @property({ type: Object })
  private [shapes]: NodeShape[] = []

  @property({ type: Object })
  editors!: State['editors']

  @property({ type: Object })
  components!: State['components']

  @property({ type: Object })
  rendererOptions!: State['renderer']

  @property({ type: Boolean, attribute: 'no-editor-switches' })
  noEditorSwitches = false

  constructor() {
    super()
    this[notify] = (detail: any) => {
      this.dispatchEvent(new CustomEvent('changed', { detail }))
    }
  }

  async connectedCallback() {
    await ensureEventTarget()
    await loadMixins()

    store().dispatch.editors.loadDash()
    store().dispatch.forms.connect(id(this))
    store().dispatch.resources.connect(id(this))
    store().dispatch.shapes.connect(id(this))

    super.connectedCallback()

    this.resource = this[resourceSymbol]
    this.shapes = this[shapesSymbol]
  }

  disconnectedCallback() {
    store().dispatch.forms.disconnect(id(this))
    super.disconnectedCallback()
  }

  @property({ type: Object })
  state!: FormState

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)
    if (_changedProperties.has('noEditorSwitches')) {
      store().dispatch.forms.toggleSwitching({ form: id(this), switchingEnabled: !this.noEditorSwitches })
    }
  }

  get resource(): GraphPointer<FocusNode> | undefined {
    return this[resourceSymbol]
  }

  set resource(rootPointer: GraphPointer<FocusNode> | undefined) {
    if (!rootPointer) return

    this[resourceSymbol] = rootPointer
    store().dispatch.resources.setRoot({ form: id(this), rootPointer })
  }

  value: DatasetCore | undefined

  get shapes(): AnyPointer | DatasetCore | undefined {
    return this[shapesSymbol]
  }

  set shapes(shapesGraph: AnyPointer | DatasetCore | undefined) {
    if (!shapesGraph) return

    this[shapesSymbol] = shapesGraph
    store().dispatch.shapes.setGraph({
      form: id(this),
      shapesGraph,
    })
  }

  render() {
    if (!this.rendererOptions.ready) {
      store().dispatch.renderer.loadDependencies()

      return this.rendererOptions.strategy.initialising()
    }

    return html`<style>${this.rendererOptions.styles}</style> ${this.renderer.render({
      form: id(this),
      editors: this.editors,
      state: this.state,
      components: this.components,
      actions: store().dispatch,
      strategy: this.rendererOptions.strategy,
      shapes: this[shapes],
    })}`
  }

  mapState(state: State) {
    state.resources.get(id(this))?.changeNotifier.onChange(this[notify])

    return {
      state: state.forms.instances.get(id(this)),
      value: state.resources.get(id(this))?.graph?.dataset,
      [shapes]: state.shapes.get(id(this))?.shapes || [],
      rendererOptions: state.renderer,
      editors: state.editors,
      components: state.components,
    }
  }
}
