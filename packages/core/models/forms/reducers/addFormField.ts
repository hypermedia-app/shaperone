import type { PropertyShape } from '@rdfine/shacl'
import type { NamedNode } from '@rdfjs/types'
import type { MultiPointer } from 'clownface'
import type { FocusNode } from '../../../index.js'
import { objectStateProducer } from '../objectStateProducer.js'
import { canAddObject, canRemoveObject } from '../lib/property.js'
import type { SingleEditorMatch } from '../../editors/index.js'
import { nextid } from '../lib/objectid.js'
import env from '../../../env.js'

export interface Params {
  focusNode: FocusNode
  property: PropertyShape
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  overrides: MultiPointer | undefined
}

export const addFormField = objectStateProducer<Params>((state, {
  property,
  editors,
  selectedEditor,
  overrides,
}, currentProperty) => {
  const nodeKind = overrides?.out(env().ns.sh.nodeKind).term as any

  currentProperty.objects.push({
    key: nextid(),
    editors,
    selectedEditor,
    editorSwitchDisabled: !state.shouldEnableEditorChoice(),
    validationResults: [],
    hasErrors: false,
    nodeKind,
    overrides,
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
})
