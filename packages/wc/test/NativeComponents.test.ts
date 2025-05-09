import { dash, xsd } from '@tpluscode/rdf-ns-builders'
import { expect, fixture, oneEvent, chai } from '@open-wc/testing'
import $rdf from '@shaperone/testing/env.js'
import type { MultiEditorTestFixture, SingleEditorTestFixture } from '@shaperone/testing'
import { editorTestParams } from '@shaperone/testing'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import { shrink } from '@zazuko/prefixes'
import type { TemplateResult } from 'lit'
import * as staticLit from 'lit/static-html.js'
import { spread } from '@open-wc/lit-helpers'
import type { ComponentConstructor } from '@hydrofoil/shaperone-core/models/components/index.js'
import { setEnv } from '@hydrofoil/shaperone-core/env.js'
import rdfMatchers from 'mocha-chai-rdf/matchers.js'
import * as components from '../NativeComponents.js'
import { getEditorTagName } from '../components/editor.js'
import URIEditor from '../elements/URIEditor.js'
import BooleanSelectEditor from '../elements/BooleanSelect.js'
import TextFieldEditor from '../elements/TextField.js'

chai.use(rdfMatchers)

describe('NativeComponents', () => {
  before(() => {
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

  interface Render {
    (params: SingleEditorTestFixture | MultiEditorTestFixture): TemplateResult
  }

  function define(component: ComponentConstructor): Render {
    const tagName = getEditorTagName(component.editor)
    if (!customElements.get(tagName)) {
      customElements.define(tagName, component)
    }

    const tag = staticLit.literal`${staticLit.unsafeStatic(tagName)}`
    return (params) => {
      // prepend object properties of params with a dot
      const bindings = Object.entries(params).reduce((acc, [key, value]) => {
        if (key === 'object' || key === 'objects') {
          return acc
        }
        return {
          ...acc,
          [`.${key}`]: value,
        }
      }, {})
      return staticLit.html`<${tag} ${spread(bindings)}></${tag}>`
    }
  }

  for (const editor of supportedEditors) {
    const Component = components.editors.find(c => c.editor.equals(editor))

    describe(shrink(editor.value), () => {
      let render: Render

      before(async () => {
        if (Component) {
          render = define(Component)
        }
      })

      it('is implemented', () => {
        expect(Component).to.be.ok
      })

      it('sets native validity', async () => {
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
        const element = await fixture(render(params))

        // then
        await expect(element).shadowDom.to.equalSnapshot()
      })

      it('is not disabled by default', async () => {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })
        const params = editorTestParams({
          object: graph.literal(''),
        })

        // when
        const element = await fixture(render(params))

        // then
        await expect(element).shadowDom.to.equalSnapshot()
      })

      it('sets disabled when it is dash:readOnly', async () => {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })
        const params = editorTestParams({
          object: graph.literal(''),
          property: {
            readOnly: true,
          },
        })

        // when
        const element = await fixture(render(params))

        // then
        await expect(element).shadowDom.to.equalSnapshot()
      })
    })
  }

  describe(shrink(dash.URIEditor.value), () => {
    let render: Render
    before(async () => {
      render = define(URIEditor)
    })

    it('updates with NamedNode', async () => {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal(''),
        datatype: xsd.date,
      })
      const component = await fixture(render(params))
      const input = component.shadowRoot!.querySelector('input')!

      // when
      input.value = 'http://foo.bar/'
      setTimeout(() => input.dispatchEvent(new Event('blur')))

      const { detail } = await oneEvent(component, 'value-changed')

      // then
      expect(detail.value).to.eq($rdf.namedNode('http://foo.bar/'))
    })
  })

  describe(shrink(dash.BooleanSelectEditor.value), () => {
    let render: Render
    before(async () => {
      render = define(BooleanSelectEditor)
    })

    function change(input: HTMLSelectElement, index: number) {
      input.selectedIndex = index
      setTimeout(() => input.dispatchEvent(new Event('change')))
    }

    it('clears when selecting empty <option>', async () => {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('true'),
        datatype: xsd.boolean,
      })
      const el = await fixture(render(params))
      const input = el.shadowRoot!.querySelector('select')!

      // when
      change(input, 0)
      const ev = oneEvent(el, 'value-changed')

      // then
      expect(ev).to.be.ok
    })

    it('sets correct selection', async () => {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('false'),
        datatype: xsd.boolean,
      })

      // when
      const el = await fixture(render(params))
      const input = el.shadowRoot!.querySelector('select')!

      // then
      expect(input.selectedOptions.item(0)?.selected).to.be.true
    })

    it('updates when selecting', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const params = editorTestParams({
        object: graph.literal(''),
      })
      const el = await fixture(render(params))
      const input = el.shadowRoot!.querySelector('select')!

      // when
      change(input, 1)
      const { detail } = await oneEvent(el, 'value-changed')

      // then
      expect(detail.value).to.deep.eq($rdf.literal('true', xsd.boolean))
    })
  })

  describe(shrink(dash.TextFieldEditor.value), () => {
    let render: Render
    before(async () => {
      render = define(TextFieldEditor)
    })

    it('renders input[type=number] when object is xsd:integer literal', async () => {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('10', xsd.integer),
        datatype: xsd.integer,
      })

      // when
      const input = await fixture(render(params))

      // then
      await expect(input).shadowDom.to.equalSnapshot()
    })

    it('renders input[type=number] when object is xsd:decimal literal', async () => {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.literal('10.2', xsd.decimal),
        datatype: xsd.decimal,
      })

      // when
      const input = await fixture(render(params))

      // then
      await expect(input).shadowDom.to.equalSnapshot()
    })
  })
})
