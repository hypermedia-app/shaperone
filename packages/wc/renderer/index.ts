import { FormState } from '@hydrofoil/shaperone-core/state/form'
import type * as SharedStore from '@hydrofoil/shaperone-core/state'
import type * as InstanceStore from '../store'
import { TemplateResult } from 'lit-element'
import { NamedNode } from 'rdf-js'

export interface RenderParams {
  form: FormState
  state: InstanceStore.State
  actions: InstanceStore.Dispatch & {
    form: SharedStore.Dispatch['form']
    components: {
      load(editor: NamedNode): void
    }
  }
}

export interface Renderer {
  render(params: RenderParams): TemplateResult
}
