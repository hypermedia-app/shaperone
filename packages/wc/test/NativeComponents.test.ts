import { dash, xsd } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdfjs/term-set'
import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { editorTestParams, sinon } from '@shaperone/testing'
import { RenderFunc } from '@hydrofoil/shaperone-core/models/components'
import { fromPointer } from '@rdfine/shacl/lib/ValidationResult'
import { blankNode } from '@shaperone/testing/nodeFactory'
import * as components from '../NativeComponents'
import { Render } from '../index'

describe('NativeComponents', () => {
  const supportedEditors = new TermSet([
    dash.TextFieldEditor,
    dash.TextAreaEditor,
    dash.EnumSelectEditor,
    dash.InstancesSelectEditor,
    dash.URIEditor,
    dash.DatePickerEditor,
    dash.DateTimePickerEditor,
    dash.BooleanSelectEditor,
  ])

  for (const editor of supportedEditors) {
    const component = Object.values(components).find(c => c.editor.equals(editor))

    describe(editor.value, () => {
      let render: RenderFunc<any, any, any>

      before(async () => {
        if (component) {
          render = await component.lazyRender()
        }
      })

      it('is implemented', () => {
        expect(render).to.be.ok
      })

      it('sets native validity', async () => {
        // given
        const graph = cf({ dataset: $rdf.dataset() })
        const { params, actions } = editorTestParams({
          object: graph.literal(''),
        })
        params.value.hasErrors = true
        params.value.validationResults = [{
          matchedTo: 'object',
          result: fromPointer(blankNode(), {
            resultMessage: 'invalid',
          }),
        }]

        // when
        const element = await fixture(render(params, actions))

        // then
        expect(element.getAttribute('part')).to.contain('component invalid')
      })

      it('is not disabled by default', async () => {
        // given
        const graph = cf({ dataset: $rdf.dataset() })
        const { params, actions } = editorTestParams({
          object: graph.literal(''),
        })

        // when
        const element = await fixture(render(params, actions))

        // then
        expect(element.getAttribute('readonly')).to.be.null
        expect(element.getAttribute('disabled')).to.be.null
      })

      it('sets disabled when it is dash:readOnly', async () => {
        // given
        const graph = cf({ dataset: $rdf.dataset() })
        const { params, actions } = editorTestParams({
          object: graph.literal(''),
          property: {
            readOnly: true,
          },
        })

        // when
        const element = await fixture(render(params, actions))

        // then
        expect(element.getAttribute('readonly')).not.to.be.null
        expect(element.getAttribute('disabled')).not.to.be.null
      })
    })
  }

  describe(dash.URIEditor.value, () => {
    let render: Render
    before(async () => {
      render = await components.uriEditor.lazyRender()
    })

    it('updates with NamedNode', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })
      const input = await fixture<HTMLInputElement>(render(params, actions))

      // when
      input.value = 'http://foo.bar/'
      input.dispatchEvent(new Event('blur'))

      // then
      expect(actions.update).to.have.been.calledOnceWith(sinon.match({
        value: 'http://foo.bar/',
        termType: 'NamedNode',
      }))
    })
  })

  describe(dash.BooleanSelectEditor.value, () => {
    let render: Render
    before(async () => {
      render = await components.nativeBooleanSelect.lazyRender()
    })

    function change(input: HTMLSelectElement, index: number) {
      input.selectedIndex = index
      input.dispatchEvent(new Event('change'))
    }

    it('clears when selecting empty <option>', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal('true'),
        datatype: xsd.boolean,
      })
      const input = await fixture<HTMLSelectElement>(render(params, actions))

      // when
      change(input, 0)

      // then
      expect(actions.clear).to.have.been.calledOnce
    })

    it('sets correct selection', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal('false'),
        datatype: xsd.boolean,
      })

      // when
      const input = await fixture<HTMLSelectElement>(render(params, actions))

      // then
      expect(input.selectedOptions.item(0)?.selected).to.be.true
    })

    it('updates when selecting', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams({
        object: graph.literal(''),
      })
      const input = await fixture<HTMLSelectElement>(render(params, actions))

      // when
      change(input, 1)

      // then
      expect(actions.update).to.have.been.calledOnceWith(sinon.match({
        value: 'true',
        termType: 'Literal',
        datatype: {
          ...xsd.boolean,
        },
      }))
    })
  })
})
