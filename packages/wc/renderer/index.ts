import type { FormState } from '@hydrofoil/shaperone-core/models/forms'
import type { EditorsState } from '@hydrofoil/shaperone-core/models/editors'
import type { TemplateResult } from 'lit-element'
import type { ComponentsState } from '@hydrofoil/shaperone-core/models/components'
import type { Dispatch } from '../store'
import type { RendererState } from './model'

export interface RenderParams {
  form: symbol
  editors: EditorsState
  state: FormState
  components: ComponentsState
  actions: Dispatch
  strategy: RendererState['strategy']
}

export interface Renderer {
  render(params: RenderParams): TemplateResult
}
