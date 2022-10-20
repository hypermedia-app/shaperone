import { TextField, TextFieldEditor } from '@hydrofoil/shaperone-core/lib/components/textField'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import { SlInput } from '@shoelace-style/shoelace'
import { TextFieldWithLang, TextFieldWithLangEditor } from '@hydrofoil/shaperone-core/lib/components/textFieldWithLang'
import { URIEditor, URI } from '@hydrofoil/shaperone-core/lib/components/uri'
import * as components from '../components'
import { ShSlWithLangEditor } from '../elements/sh-sl-with-lang-editor'

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
})
