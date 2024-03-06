import type { PropertyShape } from '@rdfine/shacl'
import type { NamedNode } from '@rdfjs/types'
import type { MultiPointer } from 'clownface'
import type { FocusNode } from '../../../index.js'
import { objectStateProducer } from '../objectStateProducer.js'
import { formStateReducer, BaseParams } from '../../index.js'
import { canAddObject, canRemoveObject } from '../lib/property.js'
import type { SingleEditorMatch } from '../../editors/index.js'
import { nextid } from '../lib/objectid.js'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  overrides: MultiPointer | undefined
  componentState: Record<string, unknown> | undefined
}

export const addFormField = formStateReducer(objectStateProducer<Params>((state, {
  property,
  editors,
  selectedEditor,
  overrides,
  componentState = {},
}, currentProperty) => {
  const nodeKind = overrides?.out(state.env.ns.sh.nodeKind).term as any

  currentProperty.objects.push({
    key: nextid(),
    editors,
    selectedEditor,
    editorSwitchDisabled: !state.shouldEnableEditorChoice(),
    componentState: {
      ...componentState,
      ready: false,
    },
    validationResults: [],
    hasErrors: false,
    nodeKind,
    overrides,
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
}))
