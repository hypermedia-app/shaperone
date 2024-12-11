import $rdf from '@zazuko/env/web.js'
import type { MatcherDecorator } from '@hydrofoil/shaperone-core/models/editors/index.js'

const { dash, dcterms, rdfs, schema } = $rdf.ns

const multilineProperties = $rdf.termSet([
  dcterms.description,
  schema.description,
  rdfs.comment,
])

export const preferMultiline: MatcherDecorator = {
  term: dash.TextAreaEditor,
  decorate: ({ match }) => (shape, value) => {
    // call the original matcher
    const score = match(shape, value)

    if (score && [...multilineProperties].some(prop => shape.pathEquals(prop))) {
      // increase the score if the property is one of the "multiline properties"
      return score + 10
    }

    return score
  },
}
