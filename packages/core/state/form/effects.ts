import { Dispatch } from '../../state'
import { NamedNode } from 'rdf-js'

export function effects(dispatch: Dispatch) {
  return {
    async loadEditor({ editor, imports }: { editor: NamedNode; imports: Array<Promise<unknown>> }) {
      dispatch.form.editorLoading({ editor })

      await Promise.all(imports)

      dispatch.form.editorLoaded({ editor })
    },
  }
}
