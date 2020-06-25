import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { TemplateResult } from 'lit-element'
import { ComponentsState } from '@hydrofoil/shaperone-core/models/components'
import { Dispatch } from '../store'
import { ShaperoneForm } from '../ShaperoneForm'
import { RendererState } from './model'

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
