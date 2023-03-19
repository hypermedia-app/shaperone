import clownface, { GraphPointer } from 'clownface'
import $rdf from '@rdfjs/dataset'
import { BlankNode, Term } from 'rdf-js'
import { SetObjectParams } from '../reducers/updateObject'
import type { Store } from '../../../state'

function rewrite(prefix: string, original: GraphPointer): GraphPointer {
  function prefixBlank(term: BlankNode | Term) {
    if (term.termType !== 'BlankNode') {
      return term
    }

    return $rdf.blankNode(`${prefix}_${term.value}`)
  }

  const newPointer = clownface({ dataset: $rdf.dataset() })
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
      dispatch.forms.setObjectValue({ newValue, ...rest })
    } else {
      dispatch.forms.setObjectValue(arg)
    }
  }
}
