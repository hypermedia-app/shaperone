import * as strategy from '../lib/renderer'
import { RendererState } from './model'

export const DefaultStrategy: RendererState['strategy'] = {
  form: strategy.defaultFormRenderer,
  focusNode: strategy.defaultFocusNodeRenderer,
  group: strategy.defaultGroupRenderer,
  property: strategy.defaultPropertyRenderer,
  object: strategy.defaultObjectRenderer,
  initialising() {
    return 'Initialising form'
  },
}
