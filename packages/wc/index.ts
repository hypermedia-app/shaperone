/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc
 */

export { configure } from './configure.js'
export type { ConfigCallback } from './configure.js'

export type { ShaperoneForm } from './ShaperoneForm.js'

export type { SingleEditor, MultiEditor } from '@hydrofoil/shaperone-core'

export { SingleEditorBase as SingleEditorComponent } from './elements/SingleEditorBase.js'
export { MultiEditorBase as MultiEditorComponent } from './elements/MultiEditorBase.js'

export type { LayoutElements } from './renderer/model.js'

export { ScopedDependencyLoader } from './components/ScopedDependencyLoader.js'
export { GlobalDependencyLoader } from './components/GlobalDependencyLoader.js'
