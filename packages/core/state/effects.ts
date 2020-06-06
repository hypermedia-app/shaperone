import { Dispatch } from '../state'
import type { SingleContextClownface } from 'clownface'
import { Shape } from '@rdfine/shacl'
import { FocusNode } from '../index'
import rdfine from '@tpluscode/rdfine'
import { NamedNode } from 'rdf-js'

export function effects(dispatch: Dispatch) {
  return {
    async initAsync(params: { shape: SingleContextClownface | Shape; focusNode: FocusNode }) {
      const { focusNode } = params
      let shape: Shape

      if ('_context' in params.shape) {
        const { ShapeDependencies } = (await import('@rdfine/shacl/dependencies/Shape.js'))
        rdfine.factory.addMixin(...Object.values(ShapeDependencies))
        shape = rdfine.factory.createEntity(params.shape)
      } else {
        shape = params.shape
      }

      dispatch.form.initialize({
        shape,
        focusNode,
      })
    },

    async loadEditor({ editor, imports }: { editor: NamedNode; imports: Array<Promise<unknown>> }) {
      dispatch.form.editorLoading({ editor })

      await Promise.all(imports)

      dispatch.form.editorLoaded({ editor })
    },
  }
}
