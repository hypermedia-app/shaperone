import 'api-viewer-element'
import clownface from 'clownface'
import { NodeShapeMixin } from '@rdfine/shacl'
import { dataset } from '@rdf-esm/dataset'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import RdfResource from '@tpluscode/rdfine'
import { ShaperoneForm } from '../ShaperoneForm'
import '../shaperone-form'

export class ShaperoneFormDemo extends ShaperoneForm {
  async connectedCallback() {
    await super.connectedCallback()
    this.shapes = new NodeShapeMixin.Class(clownface({ dataset: dataset() }).blankNode(), {
      property: [{
        path: rdfs.label,
        name: 'Label',
        maxCount: 2,
      }, {
        path: rdfs.comment,
        name: 'Description',
        maxCount: 1,
        [dash.singleLine.value]: false,
      }],
    }).pointer

    this.resource = new RdfResource(clownface({ dataset: dataset() }).blankNode(), {
      [rdfs.label.value]: 'Example resource',
      [rdfs.comment.value]: 'The resource is initialised with some values',
    }).pointer
  }
}

import('../custom-elements.json').then((data: any) => {
  const demoViewer = document.querySelector('api-viewer')
  if (demoViewer) {
    demoViewer.elements = data.tags
  }
})
