import type { FormState } from '@hydrofoil/shaperone-core/models/forms'
import type { TemplateResult } from 'lit-element'
import type { ComponentsState } from '@hydrofoil/shaperone-core/models/components'
import type { Dispatch } from '../store'
import type { ShaperoneForm } from '../ShaperoneForm'
import type { RendererState } from './model'

export interface RenderParams {
  form: ShaperoneForm
  state: FormState
  components: ComponentsState
  actions: Dispatch
  strategy: RendererState['strategy']
}

export interface Renderer {
  render(params: RenderParams): TemplateResult
}
