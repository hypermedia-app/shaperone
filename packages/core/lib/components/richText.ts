import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { CoreComponent } from '../components'

/**
 * Instance state of rich text component
 */
export interface RichText extends ComponentInstance {
}

export interface RichTextEditor extends SingleEditorComponent<RichText> {
}

/**
 * Extend to implement [DASH rich text editor](http://datashapes.org/forms.html#RichTextEditor)
 */
export const richText: CoreComponent<RichTextEditor> = {
  editor: dash.RichTextEditor,
}
