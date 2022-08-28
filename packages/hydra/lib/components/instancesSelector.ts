import type { MatcherDecorator } from '@hydrofoil/shaperone-core/models/editors'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'

/**
 * Extends `dash:InstancesSelectEditor` to value hydra-backed properties higher
 *
 * @returns `1` when `?shape hydra:collection ?any` or `?shape hydra:search ?any`
 * @returns base matcher otherwise
 */
export const matcher: MatcherDecorator = {
  term: dash.InstancesSelectEditor,
  decorate({ match }) {
    return function (shape, value) {
      if (shape.pointer.out(hydra.collection).term?.termType === 'NamedNode') {
        return 1
      }
      if (shape.pointer.out(hydra.search).term) {
        return 1
      }
      return match(shape, value)
    }
  },
}

export { decorator } from './searchDecorator.js'
