import { TextField, TextFieldEditor } from '@hydrofoil/shaperone-core/lib/components/textField'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import { SlCheckbox, SlInput } from '@shoelace-style/shoelace'
import { TextFieldWithLang, TextFieldWithLangEditor } from '@hydrofoil/shaperone-core/lib/components/textFieldWithLang'
import { URIEditor, URI } from '@hydrofoil/shaperone-core/lib/components/uri'
import { BooleanSelect, BooleanSelectEditor } from '@hydrofoil/shaperone-core/lib/components/booleanSelect'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { Details, DetailsEditor } from '@hydrofoil/shaperone-core/lib/components/details'
import { blankNode } from '@shaperone/testing/nodeFactory'
import { ShSlWithLangEditor } from '../elements/sh-sl-with-lang-editor'
import * as components from '../components'

describe('wc-shoelace/components', () => {
  describe('textField', () => {
    let component: TextField

    beforeEach(async () => {
      component = {
        ...components.textField,
        render: await components.textField.lazyRender(),
      }
    })

    it('is readonly when dash:readOnly true', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<TextFieldEditor>({
        property: {
          readOnly: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const result = await fixture<SlInput>(component.render(params, actions))

      // then
      expect(result.readonly).to.be.true
    })
  })

  describe('textFieldWithLang', () => {
    let component: TextFieldWithLang

    beforeEach(async () => {
      component = {
        ...components.textFieldWithLang,
        render: await components.textFieldWithLang.lazyRender(),
      }
    })

    it('is readonly when dash:readOnly true', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<TextFieldWithLangEditor>({
        property: {
          readOnly: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const result = await fixture<ShSlWithLangEditor>(component.render(params, actions))

      // then
      expect(result.readonly).to.be.true
    })
  })

  describe('uri', () => {
    let component: URI

    beforeEach(async () => {
      component = {
        ...components.uri,
        render: await components.uri.lazyRender(),
      }
    })

    it('is readonly when dash:readOnly true', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<URIEditor>({
        property: {
          readOnly: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const result = await fixture<SlInput>(component.render(params, actions))

      // then
      expect(result.readonly).to.be.true
    })
  })

  describe('boolean', () => {
    let component: BooleanSelect

    beforeEach(async () => {
      component = {
        ...components.boolean,
        render: await components.boolean.lazyRender(),
      }
    })

    it('is disabled when dash:readOnly true', async () => {
      // given
      const { params, actions } = editorTestParams<BooleanSelectEditor>({
        property: {
          readOnly: true,
        },
      })

      // when
      const result = await fixture<SlCheckbox>(component.render(params, actions))

      // then
      expect(result.disabled).to.be.true
    })

    it('updates when checked', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<BooleanSelectEditor>({
        object: graph.node($rdf.literal('false', xsd.boolean)),
      })

      // when
      const result = await fixture<SlCheckbox>(component.render(params, actions))
      result.click()
      await result.updateComplete

      // then
      expect(actions.update).to.have.been.calledWith(graph.literal('true', xsd.boolean).term)
    })

    it('updates when unchecked', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<BooleanSelectEditor>({
        object: graph.node($rdf.literal('true', xsd.boolean)),
      })

      // when
      const result = await fixture<SlCheckbox>(component.render(params, actions))
      result.click()
      await result.updateComplete

      // then
      expect(actions.update).to.have.been.calledWith(graph.literal('false', xsd.boolean).term)
    })

    it('is checked when value is "true"^^xsd:boolean', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<BooleanSelectEditor>({
        object: graph.node($rdf.literal('true', xsd.boolean)),
      })

      // when
      const result = await fixture<SlCheckbox>(component.render(params, actions))

      // then
      expect(result.checked).to.be.true
      expect(result.indeterminate).to.be.false
    })

    it('is unchecked when value is "false"^^xsd:boolean', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<BooleanSelectEditor>({
        object: graph.node($rdf.literal('false', xsd.boolean)),
      })

      // when
      const result = await fixture<SlCheckbox>(component.render(params, actions))

      // then
      expect(result.checked).to.be.false
      expect(result.indeterminate).to.be.false
    })

    it('is indeterminate and unchecked when unset', async () => {
      // given
      const { params, actions } = editorTestParams<BooleanSelectEditor>()

      // when
      const result = await fixture<SlCheckbox>(component.render(params, actions))

      // then
      expect(result.checked).to.be.false
      expect(result.indeterminate).to.be.true
    })
  })

  describe('details', () => {
    let component: DetailsEditor

    beforeEach(async () => {
      component = {
        ...components.details,
        render: await components.details.lazyRender(),
      }
    })

    describe('init', () => {
      it("applies default value of 'open' state property if not set", () => {
        // given
        const { params, actions } = editorTestParams<Details>({
          object: blankNode(),
        })

        // when
        component.init?.(params, actions)

        // then
        expect(params.updateComponentState).to.have.been.calledWith({
          open: true,
        })
      })

      it("does not overwrite 'open' state property if set", () => {
        // given
        const { params, actions } = editorTestParams<Details>({
          object: blankNode(),
          componentState: {
            open: false,
          },
        })

        // when
        component.init?.(params, actions)

        // then
        expect(params.updateComponentState).not.to.have.been.called
      })
    })
  })
})
