import { html, fixture, oneEvent, expect } from '@open-wc/testing'
import { NodeShapeMixin } from '@rdfine/shacl'
import clownface from 'clownface'
import { dataset, literal, namedNode } from '@rdf-esm/dataset'
import { schema } from '@tpluscode/rdf-ns-builders'
import { store } from '../store'
import { id } from '../ShaperoneForm'

describe('shaperone-form', () => {
  const shape = new NodeShapeMixin.Class(
    clownface({ dataset: dataset() }).blankNode(),
    {
      property: {
        id: namedNode('schema-name'),
        path: schema.name,
      },
    },
  )

  it('dispatches event when object values change', async () => {
    // given
    const resource = clownface({ dataset: dataset() }).blankNode()
    const form = await fixture(html`<shaperone-form .shapes="${shape}" .resource="${resource}"></shaperone-form>`)

    // when
    store().dispatch.forms.updateObject({
      form: id(form),
      focusNode: resource,
      newValue: literal('new'),
      oldValue: literal(''),
      property: shape.property[0],
    })
    const foo = await oneEvent(form, 'changed')

    // then
    expect(foo.detail.focusNode.value).to.equal(resource.value)
    expect(foo.detail.property).to.equal(shape.property)
  })
})
