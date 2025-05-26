/**
 * @packageDocumentation
 * @module shaperone
 */

export { configure } from './configure.js'
export type { ConfigCallback } from './configure.js'

export type { ShaperoneForm } from './ShaperoneForm.js'

export type { SingleEditor, MultiEditor } from '@shaperone/core'

export { SingleEditorBase as SingleEditorComponent } from './editors/SingleEditorBase.js'
export { MultiEditorBase as MultiEditorComponent } from './editors/MultiEditorBase.js'

export type { LayoutElements } from './renderer/model.js'

export { ScopedDependencyLoader } from './components/ScopedDependencyLoader.js'
export { GlobalDependencyLoader } from './components/GlobalDependencyLoader.js'
