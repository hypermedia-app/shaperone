import { html } from 'lit'
import { fixture, oneEvent, expect } from '@open-wc/testing'
import rdf from '@shaperone/testing/env.js'
import { propertyShape } from '@shaperone/testing/util.js'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import { setEnv } from '@hydrofoil/shaperone-core/env.js'
import { store } from '../store.js'
import type { ShaperoneForm } from '../ShaperoneForm.js'
import { configure } from '../configure.js'

describe('shaperone-form', () => {
  before(async () => {
    await configure()
  })

  beforeEach(() => {
    setEnv(rdf)
  })

  const shape = rdf.rdfine.sh.NodeShape(rdf.clownface().blankNode())
  shape.property = [propertyShape(shape.pointer.blankNode(), {
    id: rdf.namedNode('schema-name'),
    path: rdf.ns.schema.name,
  })]

  it('sets a default resource pointer', async () => {
    // given
    const form = await fixture<ShaperoneForm>(html`<shaperone-form></shaperone-form>`)

    // then
    expect(form.resource?.term.equals(rdf.namedNode(''))).to.be.true
  })

  xit('dispatches event when object values change', async () => {
    // given
    const resource: FocusNode = rdf.clownface().blankNode()
    const form = await fixture(html`<shaperone-form .shapes="${shape.pointer}" .resource="${resource}"></shaperone-form>`)

    // when
    store().dispatch.form.setObjectValue({
      focusNode: resource,
      newValue: rdf.literal('new'),
      property: shape.property[0],
      object: store().state.form.focusNodes[resource.value].properties[0].objects[0],
    })
    const foo = await oneEvent(form, 'changed')

    // then
    expect(foo.detail.focusNode.value).to.equal(resource.value)
    expect(foo.detail.property.id).to.equal(shape.property[0].id)
  })
})
