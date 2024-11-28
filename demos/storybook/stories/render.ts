import type { AnyPointer, GraphPointer } from 'clownface'
import type { WebComponentsRenderer } from '@storybook/web-components'
import type { ArgsStoryFn } from '@storybook/csf'
import { css, html, LitElement } from 'lit'
import rdf from '@zazuko/env'

import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@rdfjs-elements/rdf-snippet/rdf-snippet.js'

interface Args {
  focusNode?: string
  prefixes?: string
  shapes?: string
  data?: string
}

customElements.define('shaperone-demo', class extends LitElement {
  declare dataGraph: string
  declare shapesGraph: string
  declare splitterPosition: number
  declare prefixes: string

  constructor() {
    super()
    this.splitterPosition = 400
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      slot {
        display: block;
      }

      sl-icon {
        display: block;
        margin: 0 auto;
      }

      sl-icon[name="arrow-down-circle"] {
        font-size: x-large;
      }

      sl-split-panel {
        --divider-width: 20px;
      }

      sl-split-panel [slot=start] {
        padding-right: 1em;
      }

      fieldset:not(:first-child) {
        margin-top: 1em;
      }

      fieldset:not(:last-child) {
        margin-bottom: 1em;
      }
    `
  }

  static get properties() {
    return {
      splitterPosition: { type: Number, attribute: 'splitter-position' },
      dataGraph: { type: String },
      shapesGraph: { type: String },
      prefixes: { type: String },
    }
  }

  protected firstUpdated() {
    const setDataGraph = (focusNode: AnyPointer) => {
      this.dataGraph = rdf.dataset.toCanonical(focusNode.dataset)
    }

    this.querySelector('shaperone-form')!.addEventListener('changed', (event: CustomEvent) => {
      setDataGraph(event.detail.focusNode)
    })
  }

  render() {
    return html`
      <fieldset>
        <legend>Shapes graph</legend>
        <rdf-snippet only-output
                     formats="text/turtle,application/ld+json,application/n-triples"
                     input-format="text/turtle"
                     prefixes="${this.prefixes},dash,sh"
                     .input="${this.shapesGraph}"></rdf-snippet>
      </fieldset>
      <sl-icon name="arrow-down-circle"></sl-icon>
      <fieldset>
        <legend>Rendered form</legend>
        <sl-split-panel orientation="horizontal"
                        position-in-pixels="${this.splitterPosition}">
          <sl-icon slot="divider" name="grip-vertical"></sl-icon>
          <slot slot="start"></slot>
          <div slot="end">
        </sl-split-panel>
      </fieldset>
      <sl-icon name="arrow-down-circle"></sl-icon>
      <fieldset>
        <legend>Data graph</legend>
        <rdf-snippet only-output
                     formats="text/turtle,application/ld+json,application/n-triples"
                     input-format="text/n3"
                     prefixes="${this.prefixes}"
                     .input="${this.dataGraph}"></rdf-snippet>
      </fieldset>
    `
  }
})

const render: ArgsStoryFn<WebComponentsRenderer, Args> = function ({ focusNode, prefixes, ...raw }: Args, { loaded: { shapes, data } }) {
  let resource: GraphPointer | undefined
  if (focusNode) {
    resource = data.namedNode(focusNode)
  }
  return html`
    <shaperone-demo .prefixes="${prefixes}" .shapesGraph="${raw.shapes}" .dataGraph="${raw.data}">
        <shaperone-form .shapes="${shapes}" .resource="${resource}"></shaperone-form>
    </shaperone-demo>`
}

export { render }
