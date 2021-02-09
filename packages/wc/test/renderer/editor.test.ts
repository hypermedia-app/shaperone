import { objectRenderer, propertyRenderer } from '@shaperone/testing/renderer'
import { PropertyRenderer, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer'
import { fixture, expect, html } from '@open-wc/testing'
import { sinon } from '@shaperone/testing'
import { emptyGroupState, testFocusNode, testObjectState, testPropertyState } from '@shaperone/testing/models/form'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { dash, xsd, sh } from '@tpluscode/rdf-ns-builders'
import { MultiEditorActions, SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { blankNode, defaultGraph, literal, namedNode } from '@rdf-esm/data-model'
import { Dispatch } from '@hydrofoil/shaperone-core/state'
import { renderMultiEditor, renderEditor } from '../../renderer/editor'

describe('wc/renderer/editor', () => {
  describe('multiEditor', () => {
    const editor = dash.FooEditor
    let renderer: sinon.SinonStubbedInstance<PropertyRenderer>
    let property: PropertyState

    beforeEach(() => {
      const focusNode = testFocusNode()
      property = testPropertyState()
      renderer = propertyRenderer({
        focusNode,
        property,
        group: emptyGroupState,
      })
    })

    describe('action', () => {
      let actions: MultiEditorActions
      let dispatch: sinon.SinonStubbedInstance<Dispatch['forms']>

      beforeEach(async () => {
        property.selectedEditor = editor
        const render = sinon.stub().returns(html`Multi editor`)
        renderer.context.components.components[editor.value] = {
          editor,
          loading: false,
          render,
        }

        await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)
        actions = render.firstCall.lastArg
        dispatch = renderer.context.dispatch.forms as any
      })

      describe('update', () => {
        it('sets strings as literals typed with property datatype', () => {
          // given
          property.datatype = xsd.int

          // when
          actions.update([
            'foo',
            'bar',
            literal('baz'),
          ])

          // then
          const { terms } = dispatch.replaceObjects.firstCall.firstArg
          expect(terms).to.have.deep.members([
            literal('foo', xsd.int),
            literal('bar', xsd.int),
            literal('baz'),
          ])
        })

        it('sets strings as named node when property has nodeKind sh:IRI', () => {
          // given
          property.shape.nodeKind = sh.IRI

          // when
          actions.update([
            'foo',
            'bar',
            literal('baz'),
          ])

          // then
          const { terms } = dispatch.replaceObjects.firstCall.firstArg
          expect(terms).to.have.deep.members([
            namedNode('foo'),
            namedNode('bar'),
            literal('baz'),
          ])
        })
      })
    })

    it('renders "editor missing template" when no editor is selected', async () => {
      // given
      renderer.context.templates.editor.notFound = sinon.stub().returns(html`No editor`)

      // when
      const result = await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.templates.editor.notFound).to.have.been.called
      expect(result.textContent).to.equal('No editor')
    })

    it('renders "component missing template" when editor is not implemented', async () => {
      // given
      property.selectedEditor = editor
      renderer.context.templates.component.notFound = sinon.stub().returns(html`No component`)

      // when
      const result = await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.templates.component.notFound).to.have.been.calledOn(renderer)
      expect(renderer.context.templates.component.notFound).to.have.been.calledWith(sinon.match(editor))
      expect(result.textContent).to.equal('No component')
    })

    it('loads lazy component and renders loading template', async () => {
      // given
      property.selectedEditor = editor
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
      }
      renderer.context.templates.component.loading = sinon.stub().returns(html`Please wait`)

      // when
      const result = await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.dispatch.components.load).to.have.been.called
      expect(renderer.context.templates.component.loading).to.have.been.called
      expect(result.textContent).to.equal('Please wait')
    })

    it('does not load lazy component if already loading', async () => {
      // given
      property.selectedEditor = editor
      renderer.context.components.components[editor.value] = {
        editor,
        loading: true,
      }
      renderer.context.templates.component.loading = sinon.stub()

      // when
      await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.dispatch.components.load).to.not.have.been.called
      expect(renderer.context.templates.component.loading).to.have.been.called
    })

    it('renders error template if component failed to load', async () => {
      // given
      property.selectedEditor = editor
      const reason = 'Not found'
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
        loadingFailed: {
          reason,
        },
      }
      renderer.context.templates.component.loadingFailed = sinon.stub().returns(html`Failed`)

      // when
      const result = await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.dispatch.components.load).to.not.have.been.called
      expect(renderer.context.templates.component.loadingFailed).to.have.been.calledWith(reason)
      expect(result.textContent).to.equal('Failed')
    })

    it('renders component', async () => {
      // given
      property.selectedEditor = editor
      const render = sinon.stub().returns(html`Multi editor`)
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
        render,
      }

      // when
      const result = await fixture(html`<div>${renderMultiEditor.call(renderer)}</div>`)

      // then
      expect(render).to.have.been.called
      expect(result.textContent).to.equal('Multi editor')
    })
  })

  describe('singleEditor', () => {
    const editor = dash.FooEditor
    let renderer: sinon.SinonStubbedInstance<ObjectRenderer>
    let property: PropertyState
    let object: PropertyObjectState

    beforeEach(() => {
      const focusNode = testFocusNode()
      property = testPropertyState()
      object = testObjectState()
      renderer = objectRenderer({
        focusNode,
        property,
        object,
        group: emptyGroupState,
      })
    })

    describe('action', () => {
      let actions: SingleEditorActions
      let dispatch: sinon.SinonStubbedInstance<Dispatch['forms']>

      beforeEach(async () => {
        object.selectedEditor = editor
        const render = sinon.stub().returns(html`Single editor`)
        renderer.context.components.components[editor.value] = {
          editor,
          loading: false,
          render,
        }

        await fixture(html`<div>${renderEditor.call(renderer)}</div>`)
        actions = render.firstCall.lastArg
        dispatch = renderer.context.dispatch.forms as any
      })

      describe('update', () => {
        it('sets string as literal typed with property datatype', () => {
          // given
          property.datatype = xsd.int

          // when
          actions.update('foo')

          // then
          const { newValue } = dispatch.updateObject.firstCall.firstArg
          expect(newValue).to.have.deep.eq(literal('foo', xsd.int))
        })

        it('sets strings as named node when property has nodeKind sh:IRI', () => {
          // given
          property.shape.nodeKind = sh.IRI

          // when
          actions.update('foo')

          // then
          const { newValue } = dispatch.updateObject.firstCall.firstArg
          expect(newValue).to.have.deep.eq(namedNode('foo'))
        })
      })

      describe('focusOnObjectNode', () => {
        [namedNode('foo'), blankNode()].forEach((node) => {
          it(`calls dispatch when object is ${node.termType}`, () => {
            // given
            object.object = renderer.focusNode.focusNode.node(node)

            // when
            actions.focusOnObjectNode()

            // then
            expect(dispatch.pushFocusNode).to.have.been.called
            expect(dispatch.pushFocusNode.firstCall.firstArg.focusNode.term).to.deep.eq(object.object.term)
          })
        });

        [literal('foo'), defaultGraph()].forEach((node) => {
          it(`does not call dispatch when object is ${node.termType}`, () => {
            // given
            object.object = renderer.focusNode.focusNode.node(node)

            // when
            actions.focusOnObjectNode()

            // then
            expect(dispatch.pushFocusNode).not.to.have.been.called
          })
        })
      })

      describe('remove', () => {
        it('calls dispatch', () => {
          // when
          actions.remove()

          // then
          expect(dispatch.removeObject).to.have.been.called
        })
      })

      describe('clear', () => {
        it('calls dispatch', () => {
          // when
          actions.clear()

          // then
          expect(dispatch.clearValue).to.have.been.called
        })
      })
    })

    it('renders "editor missing template" when no editor is selected', async () => {
      // given
      renderer.context.templates.editor.notFound = sinon.stub().returns(html`No editor`)

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.templates.editor.notFound).to.have.been.called
      expect(result.textContent).to.equal('No editor')
    })

    it('renders "component missing template" when editor is not implemented', async () => {
      // given
      object.selectedEditor = editor
      renderer.context.templates.component.notFound = sinon.stub().returns(html`No component`)

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.templates.component.notFound).to.have.been.calledOn(renderer)
      expect(renderer.context.templates.component.notFound).to.have.been.calledWith(sinon.match(editor))
      expect(result.textContent).to.equal('No component')
    })

    it('loads lazy component and renders loading template', async () => {
      // given
      object.selectedEditor = editor
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
      }
      renderer.context.templates.component.loading = sinon.stub().returns(html`Please wait`)

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.dispatch.components.load).to.have.been.called
      expect(renderer.context.templates.component.loading).to.have.been.called
      expect(result.textContent).to.equal('Please wait')
    })

    it('does not load lazy component if already loading', async () => {
      // given
      object.selectedEditor = editor
      renderer.context.components.components[editor.value] = {
        editor,
        loading: true,
      }
      renderer.context.templates.component.loading = sinon.stub()

      // when
      await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.dispatch.components.load).to.not.have.been.called
      expect(renderer.context.templates.component.loading).to.have.been.called
    })

    it('renders error template if component failed to load', async () => {
      // given
      object.selectedEditor = editor
      const reason = 'Not found'
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
        loadingFailed: {
          reason,
        },
      }
      renderer.context.templates.component.loadingFailed = sinon.stub().returns(html`Failed`)

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(renderer.context.dispatch.components.load).to.not.have.been.called
      expect(renderer.context.templates.component.loadingFailed).to.have.been.calledWith(reason)
      expect(result.textContent).to.equal('Failed')
    })

    it('renders "initializing" template when not ready', async () => {
      // given
      object.selectedEditor = editor
      const init = sinon.stub().returns(false)
      const render = sinon.stub()
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
        init,
        render,
      }
      renderer.context.templates.component.initializing = sinon.stub().returns(html`Preparing`)

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(render).not.to.have.been.called
      expect(init).to.have.been.called
      expect(result.textContent).to.equal('Preparing')
    })

    it('renders component', async () => {
      // given
      object.selectedEditor = editor
      const render = sinon.stub().returns(html`Multi editor`)
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
        render,
      }
      renderer.context.templates.component.loadingFailed = sinon.stub().returns(html`Failed`)

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(render).to.have.been.called
      expect(result.textContent).to.equal('Multi editor')
    })

    it('renders component when init is ready', async () => {
      // given
      object.selectedEditor = editor
      const render = sinon.stub().returns(html`Single editor`)
      renderer.context.components.components[editor.value] = {
        editor,
        loading: false,
        render,
        init: () => true,
      }

      // when
      const result = await fixture(html`<div>${renderEditor.call(renderer)}</div>`)

      // then
      expect(render).to.have.been.called
      expect(result.textContent).to.equal('Single editor')
    })
  })
})
