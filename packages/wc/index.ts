/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc
 */

export { configure } from './configure.js'
export type { ConfigCallback } from './configure.js'

export type { ShaperoneForm } from './ShaperoneForm.js'
export { html, css, render } from 'lit'
export type { TemplateResult } from 'lit'

export type { SingleEditor, MultiEditor } from '@hydrofoil/shaperone-core'

export { SingleEditorBase as SingleEditorComponent } from './elements/SingleEditorBase.js'
export { MultiEditorBase as MultiEditorComponent } from './elements/MultiEditorBase.js'
