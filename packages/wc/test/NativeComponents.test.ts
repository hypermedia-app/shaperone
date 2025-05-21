import { dash, xsd } from '@tpluscode/rdf-ns-builders'
import { expect, oneEvent, chai } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import { shrink } from '@zazuko/prefixes'
import { setEnv } from '@shaperone/core/env.js'
import rdfMatchers from 'mocha-chai-rdf/matchers.js'
import * as components from '../NativeComponents.js'
import URIEditor from '../elements/URIEditor.js'
import BooleanSelectEditor from '../elements/BooleanSelect.js'
import TextFieldEditor from '../elements/TextField.js'
import defineComponent from './defineComponent.js'

chai.use(rdfMatchers)

describe('NativeComponents', function () {
  before(function () {
    setEnv($rdf)
  })

  const supportedEditors = $rdf.termSet([
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
    const Component = components.editors.find(c => c.editor.equals(editor))!

    describe(shrink(editor.value), function () {
      before(defineComponent(Component))

      it('is implemented', function () {
        expect(Component).to.be.ok
      })

      it('sets native validity', async function () {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })
        const params = editorTestParams({
          object: graph.literal(''),
        })
        params.value.hasErrors = true
        params.value.validationResults = [{
          matchedTo: 'object',
          result: $rdf.rdfine.sh.ValidationResult(blankNode(), {
            resultMessage: 'invalid',
          }),
        }]

        // when
        const element = await this.component.render(params)

        // then
        await expect(element).shadowDom.to.equalSnapshot()
      })

      it('is not disabled by default', async function () {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })
        const params = editorTestParams({
          object: graph.literal(''),
        })

        // when
        const element = await this.component.render(params)

        // then
        await expect(element).shadowDom.to.equalSnapshot()
      })

      it('sets disabled when it is dash:readOnly', async function () {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })
        const params = editorTestParams({
          object: graph.literal(''),
          property: {
            readOnly: true,
          },
        })

        // when
        const element = await this.component.render(params)

        // then
        await expect(element).shadowDom.to.equalSnapshot()
      })
    })
  }

  describe(shrink(dash.URIEditor.value), function () {
    before(defineComponent(URIEditor))

    it('updates with NamedNode', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })
      const component = await this.component.render(params)
      const input = component.shadowRoot!.querySelector('input')!

      // when
      input.value = 'http://foo.bar/'
      setTimeout(() => input.dispatchEvent(new Event('blur')))

      const { detail } = await oneEvent(component, 'value-changed')

      // then
      expect(detail.value).to.eq($rdf.namedNode('http://foo.bar/'))
    })
  })

  describe(shrink(dash.BooleanSelectEditor.value), function () {
    before(defineComponent(BooleanSelectEditor))

    function change(input: HTMLSelectElement, index: number) {
      input.selectedIndex = index
      setTimeout(() => input.dispatchEvent(new Event('change')))
    }

    it('clears when selecting empty <option>', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('true'),
        datatype: xsd.boolean,
      })
      const el = await this.component.render(params)
      const input = el.shadowRoot!.querySelector('select')!

      // when
      change(input, 0)
      const ev = oneEvent(el, 'value-changed')

      // then
      expect(ev).to.be.ok
    })

    it('sets correct selection', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('false'),
        datatype: xsd.boolean,
      })

      // when
      const el = await this.component.render(params)
      const input = el.shadowRoot!.querySelector('select')!

      // then
      expect(input.selectedOptions.item(0)?.selected).to.be.true
    })

    it('updates when selecting', async function () {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const params = editorTestParams({
        object: graph.literal(''),
      })
      const el = await this.component.render(params)
      const input = el.shadowRoot!.querySelector('select')!

      // when
      change(input, 1)
      const { detail } = await oneEvent(el, 'value-changed')

      // then
      expect(detail.value).to.deep.eq($rdf.literal('true', xsd.boolean))
    })
  })

  describe(shrink(dash.TextFieldEditor.value), function () {
    before(defineComponent(TextFieldEditor))

    it('renders input[type=number] when object is xsd:integer literal', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('10', xsd.integer),
        datatype: xsd.integer,
      })

      // when
      const input = await this.component.render(params)

      // then
      await expect(input).shadowDom.to.equalSnapshot()
    })

    it('renders input[type=number] when object is xsd:decimal literal', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('10.2', xsd.decimal),
        datatype: xsd.decimal,
      })

      // when
      const input = await this.component.render(params)

      // then
      await expect(input).shadowDom.to.equalSnapshot()
    })
  })
})
