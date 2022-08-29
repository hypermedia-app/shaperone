import {
  instancesSelect,
} from '@hydrofoil/shaperone-core/components.js'
import * as select from '@hydrofoil/shaperone-core/lib/components/base/instancesSelect.js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { Lazy, MultiEditorComponent } from '@hydrofoil/shaperone-wc'

export const instancesMultiSelectEditor: Lazy<MultiEditorComponent> = {
  ...select,
  editor: sh1.InstancesMultiSelectEditor,
  init(...args: [any, any]) {
    return instancesSelect.init?.call(this, ...args) || true
  },
  async lazyRender() {
    const { render } = await import('./components/multiInstancesSelect.js')

    return render
  },
}
