import { rdfs, schema } from '@tpluscode/rdf-ns-builders'
import type { FormSettings, State } from '../index'

export type Params = { form: symbol } & Partial<FormSettings>

export function connect(map: State, { form }: Params): State {
  map.set(form, {
    focusNodes: {},
    focusStack: [],
    shouldEnableEditorChoice: () => true,
    labelProperties: [rdfs.label, schema.name],
    validationResults: [],
    hasErrors: false,
  })
  return map
}

export function disconnect(map: State, form: symbol): State {
  map.delete(form)
  return map
}
