import type { SingleEditor } from '@hydrofoil/shaperone-core'
import $rdf from '@zazuko/env/web.js'

const starRating = $rdf.namedNode('http://example.com/starRating')

export const starRatingMatcher: SingleEditor = {
  term: starRating,
  match(shape, value) {
    return shape.pathEquals($rdf.ns.schema.ratingValue) ? 50 : 0
  },
}
