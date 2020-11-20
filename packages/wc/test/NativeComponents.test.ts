import { dash, xsd } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdf-esm/term-set'
import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams, sinon } from '@shaperone/testing'
import { RenderSingleEditor } from '../index'
import * as components from '../NativeComponents'

describe('NativeComponents', () => {
  const supportedEditors = new TermSet([
    dash.TextFieldEditor,
    dash.TextAreaEditor,
    dash.EnumSelectEditor,
    dash.InstancesSelectEditor,
    dash.URIEditor,
    dash.DatePickerEditor,
    dash.DateTimePickerEditor,
  ])

  for (const editor of supportedEditors) {
    const component = Object.values(components).find(c => c.editor.equals(editor))

    describe(editor.value, () => {
      let render: any

      before(async () => {
        if (component) {
          render = await component.lazyRender()
        }
      })

      it('is implemented', () => {
        expect(render).to.be.ok
      })
    })
  }

  let render: RenderSingleEditor

  describe(dash.URIEditor.value, () => {
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
      input.focus()
      input.value = 'http://foo.bar/'
      input.blur()

      // then
      expect(actions.update).to.have.been.calledOnceWith(sinon.match({
        value: 'http://foo.bar/',
        termType: 'NamedNode',
      }))
    })
  })
})
