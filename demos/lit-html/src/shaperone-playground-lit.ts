import { customElement, LitElement, css } from 'lit-element'
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js'
import '@vaadin/vaadin-menu-bar/vaadin-menu-bar.js'
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js'
import { html } from 'lit-html'
import './shaperone-turtle-editor'

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
  a sh:NodeShape ;
  sh:targetClass schema:Person ;
  sh:property [
    sh:path schema:name ;
    sh:name "Name" ;
    sh:datatype xsd:string ;
  ] ;
  sh:property [
    sh:path schema:knows ;
    sh:class schema:Person ;
] .
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
    }`
  }

  render() {
    return html`<vaadin-app-layout>
      <h2 slot="navbar">@hydrofoil/shaperone playground</h2>
      <div class="content">
      <vaadin-split-layout id="top-splitter">
        <div style="width: 33%">
          <vaadin-menu-bar .items="${shapeMenu}"></vaadin-menu-bar>
          <shaperone-turtle-editor .value="${shape}"></shaperone-turtle-editor>
        </div>

        <vaadin-split-layout style="width: 67%">
          <div>
            <vaadin-menu-bar .items="${formMenu}"></vaadin-menu-bar>
          </div>
          <div  style="max-width: 50%">
            <vaadin-menu-bar .items="${resourceMenu}"></vaadin-menu-bar>
            <shaperone-turtle-editor></shaperone-turtle-editor>
          </div>
        </vaadin-split-layout>
      </vaadin-split-layout></div>
    </vaadin-app-layout>`
  }
}
