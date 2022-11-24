import type { PropertyShape } from '@rdfine/shacl'
import { NamedNode } from 'rdf-js'
import { MultiPointer } from 'clownface'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { FocusNode } from '../../..'
import { objectStateProducer } from '../objectStateProducer.js'
import { formStateReducer, BaseParams } from '../../index.js'
import { canAddObject, canRemoveObject } from '../lib/property.js'
import type { SingleEditorMatch } from '../../editors'
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
  const nodeKind = overrides?.out(sh.nodeKind).term as any

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
