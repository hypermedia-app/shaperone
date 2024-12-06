import type { GraphPointer } from 'clownface'
import type { BlankNode, Term } from '@rdfjs/types'
import type { SetObjectParams } from '../reducers/updateObject.js'
import type { Store } from '../../../state/index.js'
import $rdf from '../../../env.js'

function rewrite(prefix: string, original: GraphPointer): GraphPointer {
  function prefixBlank(term: BlankNode | Term) {
    if (term.termType !== 'BlankNode') {
      return term
    }

    return $rdf().blankNode(`${prefix}_${term.value}`)
  }

  const newPointer = $rdf().clownface()
    .node(prefixBlank(original.term))
  for (const { subject, predicate, object } of original.dataset) {
    newPointer.node(prefixBlank(subject))
      .addOut(predicate, prefixBlank(object))
  }

  return newPointer
}

export function updateObject(store: Store) {
  const dispatch = store.getDispatch()

  return (arg: SetObjectParams) => {
    if ('dataset' in arg.newValue) {
      const { newValue: pointer, ...rest } = arg
      if (pointer.dataset === arg.focusNode.dataset) {
        throw new Error('Pointer value must be a dataset unrelated to focus node dataset')
      }

      const prefix = arg.focusNode.blankNode().value
      const newValue = rewrite(prefix, pointer)
      dispatch.form.setObjectValue({ newValue, ...rest })
    } else {
      dispatch.form.setObjectValue(arg)
    }
  }
}
