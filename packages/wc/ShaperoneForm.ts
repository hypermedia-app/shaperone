/* eslint-disable lit/no-classfield-shadowing */
import type { PropertyValues, TemplateResult } from 'lit'
import { LitElement, css, html } from 'lit'
import { property } from 'lit/decorators.js'
import type { DatasetCore } from '@rdfjs/types'
import type { FormState, ValidationResultState } from '@hydrofoil/shaperone-core/models/forms'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { RdfResource } from '@tpluscode/rdfine'
import type { AnyPointer, GraphPointer } from 'clownface'
import type { NodeShape } from '@rdfine/shacl'
import type { Renderer } from '@hydrofoil/shaperone-core/renderer.js'
import type { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env.js'
import getEnv from '@hydrofoil/shaperone-core/env.js'
import { ensureEventTarget } from './lib/eventTarget.js'
import type { State } from './store.js'
import { store } from './store.js'
import DefaultRenderer from './renderer/index.js'
import { connect } from './components/connect.js'
import type { ConfigCallback } from './configure.js'

const resourceSymbol: unique symbol = Symbol('resource')
const shapesSymbol: unique symbol = Symbol('shapes dataset')
const shapes: unique symbol = Symbol('shapes')
const ready: unique symbol = Symbol('ready')
const configuration: unique symbol = Symbol('configuration')

/**
 * A custom element which renders a form element using graph description in [SHACL format](http://datashapes.org/forms.html).
 * The underlying value is a graph represented using the [RDF/JS data model specification](https://rdf.js.org/data-model-spec/)
 *
 * ## Usage
 *
 * This example shows the element used with the default lit renderer
 *
 * ```typescript
 * import '@hypermedia-app/shaperone-form/shaperone-form.js'
 * import Environment from '@zazuko/env/Environment.js'
 * import { configure } from '@hydrofoil/shaperone-wc/configure.js'
 * import { html } from '@hypermedia-app/shaperone-form'
 * import alcaeus from 'alcaeus/Factory.js'
 * import parent from '@zazuko/env/web.js'
 *
 * const env = new Environment([alcaeus()], { parent })
 * configure(env)
 *
 * const shapes = await env.hydra.loadResource('http://example.com/api/shape')
 * const resource = rdf.clownface().blankNode()
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
export class ShaperoneForm extends connect(store, LitElement) {
  declare dispatch: ReturnType<typeof store>['dispatch']

  private [resourceSymbol]?: FocusNode
  private [shapesSymbol]?: AnyPointer | DatasetCore | undefined
  private [ready]: boolean = false
  private [configuration]: ConfigCallback | undefined

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
   * Gets the RDF/JS environment
   *
   * @readonly
   */
  get env(): ShaperoneEnvironment {
    return getEnv()
  }

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
    this.resource = this.env.clownface().namedNode('')
  }

  async connectedCallback() {
    super.connectedCallback()

    await ensureEventTarget()

    if (this[resourceSymbol]) {
      this.resource = this[resourceSymbol]
    }
    this.shapes = this[shapesSymbol]
  }

  /**
   * Gets the internal state of the form element
   */
  @property({ type: Object })
    state!: FormState

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)
    if (_changedProperties.has('noEditorSwitches')) {
      this.dispatch.form.toggleSwitching({ switchingEnabled: !this.noEditorSwitches })
    }
  }

  /**
   * Gets or sets the resource graph as graph pointer
   */
  @property({ type: Object })
  get resource(): FocusNode | undefined {
    return this[resourceSymbol]
  }

  set resource(rootPointer: FocusNode | undefined) {
    if (!rootPointer) {
      return
    }

    this[resourceSymbol] = rootPointer
    this.dispatch.resources.setRoot({ rootPointer })
  }

  /**
   * Gets the resource as a [rdfine](https://npm.im/@tpluscode/rdfine) object
   */
  get value(): RdfResource | null {
    if (this.resource) {
      return this.env.rdfine().factory.createEntity(this.resource)
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
  @property({ type: Object })
  get shapes(): AnyPointer | DatasetCore | undefined {
    return this[shapesSymbol]
  }

  set shapes(shapesGraph: AnyPointer | DatasetCore | undefined) {
    if (!shapesGraph) return

    this[shapesSymbol] = shapesGraph
    this.dispatch.shapes.setGraph({
      shapesGraph,
    })
  }

  set configuration(value: ConfigCallback | undefined) {
    this.configure(value)

    this[configuration] = value
  }

  @property({ type: Object })
  get configuration(): ConfigCallback | undefined {
    return this[configuration]
  }

  configure(fn: ConfigCallback | undefined) {
    const { components, renderer, editors, validation } = this.dispatch

    fn?.({
      components,
      renderer,
      editors,
      validation,
    })
  }

  render() {
    if (!this[ready]) {
      this.dispatch.renderer.loadDependencies()

      return this.rendererOptions.templates.initialising()
    }

    return html`
      <style>${this.rendererOptions.styles}</style>
      <section part="form">
      ${this.renderer.render({
    env: this.env,
    editors: this.editors,
    state: this.state,
    components: this.components,
    dispatch: this.dispatch,
    templates: this.rendererOptions.templates,
    shapes: this[shapes],
  })}
      </section>
      <section part="buttons">
        <slot name="buttons"></slot>
      </section>
    `
  }

  /**
   * Triggers validation of the current resource against the shapes graph
   */
  validate(): void {
    this.dispatch.form.validate()
  }

  /**
   * @private
   */
  mapState(state: State) {
    return {
      [ready]: state.renderer.ready,
      state: state.form,
      [resourceSymbol]: state.form?.focusStack[0],
      [shapes]: state.shapes?.shapes || [],
      rendererOptions: state.renderer,
      editors: state.editors,
      components: state.components,
    }
  }

  mapEvents() {
    return {
      changed: ({ detail }: any) => {
        this.dispatchEvent(new CustomEvent('changed', { detail }))
      },
    }
  }
}
