import { html, fixture, oneEvent, expect } from '@open-wc/testing'
import { NodeShapeMixin } from '@rdfine/shacl'
import clownface from 'clownface'
import { dataset, literal, namedNode } from '@rdf-esm/dataset'
import { schema } from '@tpluscode/rdf-ns-builders'
import { propertyShape } from '@hydrofoil/shaperone-core/test/util'
import { store } from '../store'
import { id } from '../ShaperoneForm'

describe('shaperone-form', () => {
  const shape = new NodeShapeMixin.Class(clownface({ dataset: dataset() }).blankNode())
  shape.property = [propertyShape(shape.pointer.blankNode(), {
    id: namedNode('schema-name'),
    path: schema.name,
  })]

  xit('dispatches event when object values change', async () => {
    // given
    const resource = clownface({ dataset: dataset() }).blankNode()
    const form = await fixture(html`<shaperone-form .shapes="${shape}" .resource="${resource}"></shaperone-form>`)

    // when
    store().dispatch.forms.updateObject({
      form: id(form),
      focusNode: resource,
      newValue: literal('new'),
      property: shape.property[0],
      object: store().state.forms.get(id(form))!.focusNodes[resource.value].properties[0].objects[0],
    })
    const foo = await oneEvent(form, 'changed')

    // then
    expect(foo.detail.focusNode.value).to.equal(resource.value)
    expect(foo.detail.property.id).to.equal(shape.property[0].id)
  })
})
