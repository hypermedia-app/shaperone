import * as Renderer from '@hydrofoil/shaperone-core/renderer.js'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { RenderContext } from '@hydrofoil/shaperone-core/renderer.js'
import { FocusNodeState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import tsSinon from 'ts-sinon'
import type * as TsSinon from 'ts-sinon'
import { sinon } from './sinon.js'
import { testEditorsState } from './models/editors.js'
import { testFocusNodeState, testFormState, emptyGroupState } from './models/form.js'

const { stubInterface } = tsSinon as any as {
  stubInterface: typeof TsSinon.stubInterface
}

export const formRenderer = (): sinon.SinonStubbedInstance<Renderer.FormRenderer> => {
  const { form, state } = testFormState()

  return {
    actions: {
      popFocusNode: sinon.spy(),
      truncateFocusNodes: sinon.spy(),
    },
    context: {
      form,
      editors: testEditorsState(),
      state: state.get(form)!,
      components: {
        components: {},
        decorators: [],
      },
      shapes: [],
      dispatch: {
        components: stubInterface<RenderContext['dispatch']['components']>(),
        editors: stubInterface<RenderContext['dispatch']['editors']>(),
        forms: stubInterface<RenderContext['dispatch']['forms']>(),
        resources: stubInterface<RenderContext['dispatch']['resources']>(),
        shapes: stubInterface<RenderContext['dispatch']['shapes']>(),
        validation: stubInterface<RenderContext['dispatch']['validation']>(),
      },
      templates: stubInterface<RenderContext['templates']>(),
    },
    renderFocusNode: sinon.stub(),
  }
}

type TestFocusNode = { focusNode: FocusNode | FocusNodeState }

export const focusNodeRenderer = (arg: TestFocusNode): sinon.SinonStubbedInstance<Renderer.FocusNodeRenderer> => {
  const focusNode = '_context' in arg.focusNode ? testFocusNodeState(arg.focusNode)[arg.focusNode.value] : arg.focusNode
  const form = formRenderer()

  return ({
    focusNode,
    ...form,
    renderGroup: sinon.stub(),
    actions: {
      ...form.actions,
      selectGroup: sinon.spy(),
      selectShape: sinon.spy(),
      hideProperty: sinon.spy(),
      showProperty: sinon.spy(),
      clearProperty: sinon.spy(),
    },
  })
}

type TestGroup = TestFocusNode & Partial<Pick<Renderer.GroupRenderer, 'group'>>

export const groupRenderer = ({ group = emptyGroupState(), ...arg }: TestGroup): sinon.SinonStubbedInstance<Renderer.GroupRenderer> => {
  const focusNode = focusNodeRenderer(arg)

  return {
    group,
    ...focusNode,
    renderProperty: sinon.stub(),
    actions: {
      ...focusNode.actions,
      selectGroup: sinon.spy(),
    },
  }
}

type TestProperty = TestGroup & Pick<Renderer.PropertyRenderer, 'property'>

export const propertyRenderer = ({ property, ...arg }: TestProperty): sinon.SinonStubbedInstance<Renderer.PropertyRenderer> => {
  const group = groupRenderer(arg)

  return {
    property,
    ...group,
    renderObject: sinon.stub(),
    renderMultiEditor: sinon.stub(),
    actions: {
      ...group.actions,
      addObject: sinon.spy(),
      selectMultiEditor: sinon.spy(),
      selectSingleEditors: sinon.spy(),
      removeObject: sinon.spy(),
    },
  }
}

type TestObject = TestProperty & Pick<Renderer.ObjectRenderer, 'object'>

export const objectRenderer = ({ object, ...arg }: TestObject): sinon.SinonStubbedInstance<Renderer.ObjectRenderer> => {
  const property = propertyRenderer(arg)

  return {
    object,
    ...property,
    renderEditor: sinon.stub(),
    actions: {
      ...property.actions,
      remove: sinon.spy(),
      selectEditor: sinon.spy(),
    },
  }
}
