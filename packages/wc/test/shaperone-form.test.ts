import { html } from 'lit'
import { fixture, oneEvent, expect } from '@open-wc/testing'
import { fromPointer } from '@rdfine/shacl/lib/NodeShape'
import clownface from 'clownface'
import { dataset, literal, namedNode } from '@rdf-esm/dataset'
import { schema } from '@tpluscode/rdf-ns-builders'
import { propertyShape } from '@shaperone/testing/util'
import { store } from '../store'
import { id, ShaperoneForm } from '../ShaperoneForm'
import '../shaperone-form'

describe('shaperone-form', () => {
  const shape = fromPointer(clownface({ dataset: dataset() }).blankNode())
  shape.property = [propertyShape(shape.pointer.blankNode(), {
    id: namedNode('schema-name'),
    path: schema.name,
  })]

  it('sets a default resource pointer', async () => {
    // given
    const form = await fixture<ShaperoneForm>(html`<shaperone-form></shaperone-form>`)

    // then
    expect(form.resource?.term.equals(namedNode(''))).to.be.true
  })

  xit('dispatches event when object values change', async () => {
    // given
    const resource = clownface({ dataset: dataset() }).blankNode()
    const form = await fixture(html`<shaperone-form .shapes="${shape.pointer}" .resource="${resource}"></shaperone-form>`)

    // when
    store().dispatch.forms.setObjectValue({
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
