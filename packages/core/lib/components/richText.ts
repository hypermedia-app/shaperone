import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import type { CoreComponent } from '../components.js'

/**
 * Instance state of rich text component
 */
export interface RichText extends ComponentInstance {
}

export interface RichTextEditor extends SingleEditorComponent {
}

/**
 * Extend to implement [DASH rich text editor](http://datashapes.org/forms.html#RichTextEditor)
 */
export const richText: CoreComponent<RichTextEditor> = {
  editor: dash.RichTextEditor,
}
