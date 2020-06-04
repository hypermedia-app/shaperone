import { customElement, LitElement, css, property, query } from 'lit-element'
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js'
import '@vaadin/vaadin-menu-bar/vaadin-menu-bar.js'
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js'
import '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import './shaperone-turtle-editor'
import cf, { SingleContextClownface } from 'clownface'
import $rdf from 'rdf-ext'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import type { ShaperoneTurtleEditor } from './shaperone-turtle-editor'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import { turtle } from '@tpluscode/rdf-string'

const shapeMenu = [
  {
    text: 'Update form',
  },
]

const formMenu = [
  {
    text: 'Read resource',
  },
]

const resourceMenu = [
  {
    text: 'Update form',
  },
]

const shape = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.com/> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:PersonShape
  a sh:Shape ;
  sh:targetClass schema:Person ;
  sh:property [
    sh:path schema:name ;
    sh:name "Name" ;
    sh:datatype xsd:string ;
    sh:maxCount 1 ;
    sh:minCount 1
  ] ;
  sh:property [
    sh:path schema:knows ;
    sh:class schema:Person ;
] .
`

const resource = `@prefix schema: <http://schema.org/> .
@prefix ex: <http://example.com/> .

ex:John_Doe a schema:Person ;
  schema:name "John Doe" ;
  schema:knows ex:Jane_Doe .
`

@customElement('shaperone-playground-lit')
export class ShaperonePlayground extends LitElement {
  static get styles() {
    return css`:host {
      height: 100vh;
      display: block;
    }

    .content {
      height: 100%;
      display: flex;
    }

    #top-splitter {
      flex: 1;
    }

    vaadin-menu-bar {
      position: sticky;
      position: -webkit-sticky;
      z-index: 100;
      top: 0;
      background: white;
    }`
  }

  @property({ type: Object })
  shape?: SingleContextClownface

  @property({ type: Object })
  resource!: SingleContextClownface

  @query('#shapeEditor')
  shapeEditor!: ShaperoneTurtleEditor

  @query('#resourceEditor')
  resourceEditor!: ShaperoneTurtleEditor

  @query('#form')
  form!: ShaperoneForm

  async connectedCallback() {
    super.connectedCallback()

    const stream = parsers.import('text/turtle', toStream(resource))
    if (!stream) {
      throw new Error('Failed to parse resource')
    }

    const dataset = await $rdf.dataset().import(stream)
    this.resource = cf({ dataset, term: $rdf.namedNode('http://example.com/John_Doe') })
  }

  render() {
    return html`<vaadin-app-layout>
      <h2 slot="navbar">@hydrofoil/shaperone playground</h2>
      <div class="content">
      <vaadin-split-layout id="top-splitter">
        <div style="width: 33%">
          <vaadin-menu-bar .items="${shapeMenu}" @item-selected="${this.__setShape}"></vaadin-menu-bar>
          <shaperone-turtle-editor id="shapeEditor" .value="${shape}"></shaperone-turtle-editor>
        </div>

        <vaadin-split-layout style="width: 67%">
          <div>
            <vaadin-menu-bar .items="${formMenu}" @item-selected="${this.__updateResource}"></vaadin-menu-bar>
            <shaperone-form id="form" .shape="${this.shape}" .resource="${this.resource}"></shaperone-form>
          </div>
          <div style="max-width: 50%">
            <vaadin-menu-bar .items="${resourceMenu}"></vaadin-menu-bar>
            <shaperone-turtle-editor id="resourceEditor" .value="${resource}"></shaperone-turtle-editor>
          </div>
        </vaadin-split-layout>
      </vaadin-split-layout></div>
    </vaadin-app-layout>`
  }

  protected firstUpdated(_changedProperties: any): void {
    super.firstUpdated(_changedProperties)
    this.__setShape()
  }

  __updateResource() {
    this.resourceEditor.value = turtle`${this.form.value}`.toString()
  }

  async __setShape() {
    const stream = parsers.import('text/turtle', toStream(this.shapeEditor.value))
    if (!stream) {
      throw new Error('Failed to parse shape')
    }

    const dataset = await $rdf.dataset().import(stream)
    const foundShapes = cf({ dataset }).has(rdf.type, [sh.NodeShape, sh.Shape])
    if (foundShapes.terms.length === 0) {
      throw new Error('Did not find any shape')
    }

    this.shape = foundShapes.toArray()[0]
  }
}
