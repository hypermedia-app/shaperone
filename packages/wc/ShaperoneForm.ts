import { LitElement, property, css, html, PropertyValues } from 'lit-element'
import { DatasetCore } from 'rdf-js'
import type { FormState, ValidationResultState } from '@hydrofoil/shaperone-core/models/forms'
import { FocusNode, loadMixins } from '@hydrofoil/shaperone-core'
import { connect } from '@captaincodeman/rdx'
import type { RdfResource } from '@tpluscode/rdfine'
import type { AnyPointer, GraphPointer } from 'clownface'
import RdfResourceImpl from '@tpluscode/rdfine'
import { NodeShape } from '@rdfine/shacl'
import { TemplateResult } from 'lit-html'
import { Renderer } from '@hydrofoil/shaperone-core/renderer'
import { ensureEventTarget } from './lib/eventTarget'
import { store, State } from './store'
import DefaultRenderer from './renderer'
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

/**
 * A custom element which renders a form element using graph description in [SHACL format](http://datashapes.org/forms.html).
 * The underlying value is a graph represented using the [RDF/JS data model specification](https://rdf.js.org/data-model-spec/)
 *
 * ## Usage
 *
 * This example shows the element used with the default lit-html renderer
 *
 * ```typescript
 * import '@hypermedia-app/shaperone-form/shaperone-form.js'
 * import { html } from '@hypermedia-app/shaperone-form'
 * import { Hydra } from 'alcaeus/web'
 * import { dataset, blankNode } from '@rdf-esm/dataset'
 *
 * const shapes = await Hydra.loadResource('http://example.com/api/shape')
 * const resource = clownface({
 *   dataset: dataset(),
 * }).blankNode()
 *
 * const formTemplate = html`<shaperone-form .shapes=${shapes} .resource=${resource}></shaperone-form>`
 * ```
 *
 * The above snippet assumes that shapes get loaded from a remote resource and the form value is initialized with a
 * blank node without any properties.
 *
 * Such setup will render a very basic and unstyled form using native browser input elements and no specific layout.
 * Check the main documentation page for instructions on customizing the form's rendering.
 */
export class ShaperoneForm extends connect(store(), LitElement) {
  private [resourceSymbol]?: FocusNode
  private [shapesSymbol]?: AnyPointer | DatasetCore | undefined
  private [notify]: (detail: any) => void

  static get styles() {
    return [css`
      :host {
        display: block
      }`]
  }

  /**
   * Gets or sets the renderer implementation
   */
  renderer: Renderer<TemplateResult> = DefaultRenderer

  @property({ type: Array })
  private [shapes]: NodeShape[] = []

  /**
   * Gets the state of the DASH editors model
   *
   * @readonly
   */
  @property({ type: Object })
  editors!: State['editors']

  /**
   * Gets the state of the editor components
   *
   * @readonly
   */
  @property({ type: Object })
  components!: State['components']

  /**
   * Gets the state of the renderer
   *
   * @readonly
   */
  @property({ type: Object })
  rendererOptions!: State['renderer']

  /**
   * Disables the ability to change object editors. Only the one with [highest score](http://datashapes.org/forms.html#score) will be rendered
   *
   * @attr no-editor-switches
   */
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
    store().dispatch.forms.connect({
      form: id(this),
      languages: this.__languages(),
    })

    super.connectedCallback()

    this.resource = this[resourceSymbol]
    this.shapes = this[shapesSymbol]
  }

  disconnectedCallback() {
    store().dispatch.forms.disconnect(id(this))
    super.disconnectedCallback()
  }

  /**
   * Gets the internal state of the form element
   */
  @property({ type: Object })
  state!: FormState

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)
    if (_changedProperties.has('noEditorSwitches')) {
      store().dispatch.forms.toggleSwitching({ form: id(this), switchingEnabled: !this.noEditorSwitches })
    }
  }

  /**
   * Gets or sets the resource graph as graph pointer
   */
  get resource(): FocusNode | undefined {
    return this[resourceSymbol]
  }

  set resource(rootPointer: FocusNode | undefined) {
    if (!rootPointer) return

    this[resourceSymbol] = rootPointer
    store().dispatch.resources.setRoot({ form: id(this), rootPointer })
  }

  /**
   * Gets the resource as a [rdfine](https://npm.im/@tpluscode/rdfine) object
   */
  get value(): RdfResource | null {
    if (this.resource) {
      return RdfResourceImpl.factory.createEntity(this.resource)
    }

    return null
  }

  /**
   * Gets a value indicating if there are any `sh:Violation` violation results
   */
  get isValid(): boolean {
    return !this.state.hasErrors
  }

  /**
   * Get all validation results found in the {@see validationReport} graph
   */
  get validationResults(): ValidationResultState[] {
    return this.state.validationResults
  }

  /**
   * Gets a graph pointer to the latest [SHACL Validation Report](https://www.w3.org/TR/shacl/#validation-report)
   */
  get validationReport(): GraphPointer | undefined {
    return this.state.validationReport
  }

  /**
   * Gets or sets the shapes graph
   */
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

      return this.rendererOptions.templates.initialising()
    }

    return html`<style>${this.rendererOptions.styles}</style> ${this.renderer.render({
      form: id(this),
      editors: this.editors,
      state: this.state,
      components: this.components,
      dispatch: store().dispatch,
      templates: this.rendererOptions.templates,
      shapes: this[shapes],
    })}`
  }

  /**
   * Triggers validation of the current resource against the shapes graph
   */
  validate(): void {
    store().dispatch.forms.validate({
      form: id(this),
    })
  }

  /**
   * @private
   */
  mapState(state: State) {
    state.resources.get(id(this))?.changeNotifier.onChange(this[notify])

    return {
      state: state.forms.get(id(this)),
      [resourceSymbol]: state.forms.get(id(this))?.focusStack[0],
      [shapes]: state.shapes.get(id(this))?.shapes || [],
      rendererOptions: state.renderer,
      editors: state.editors,
      components: state.components,
    }
  }

  __languages() {
    const languages = this.getAttribute('languages')
    if (languages) {
      return languages.split(',')
    }

    return [...navigator.languages]
  }
}
