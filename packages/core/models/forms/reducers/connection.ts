import { rdfs, schema } from '@tpluscode/rdf-ns-builders'
import type { FormSettings, State } from '../index'

export function connect(map: State, { form, ...settings }: { form: symbol } & Partial<FormSettings>): State {
  map.set(form, {
    focusNodes: {},
    focusStack: [],
    shouldEnableEditorChoice: () => true,
    languages: settings.languages || [],
    labelProperties: [rdfs.label, schema.name],
  })
  return map
}

export function disconnect(map: State, form: symbol): State {
  map.delete(form)
  return map
}
