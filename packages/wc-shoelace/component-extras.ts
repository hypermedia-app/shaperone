import {
  instancesSelect,
} from '@hydrofoil/shaperone-core/components.js'
import * as select from '@hydrofoil/shaperone-core/lib/components/base/instancesSelect.js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { Lazy, MultiEditorComponent } from '@hydrofoil/shaperone-wc'
import type { GraphPointer } from 'clownface'
import { ComponentInstance } from '@hydrofoil/shaperone-core/models/components/index'

export interface InstancesMultiSelect extends ComponentInstance {
  instances?: GraphPointer[]
}

export const instancesMultiSelectEditor: Lazy<MultiEditorComponent<InstancesMultiSelect>> = {
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
