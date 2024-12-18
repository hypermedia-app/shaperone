import { configure } from '@hydrofoil/shaperone-wc'
import $rdf from '@zazuko/env/web.js'

const { rdf, rdfs, dash } = $rdf.ns
const starRating = $rdf.namedNode('http://example.com/starRating')

function * metadata() {
  yield $rdf.quad(starRating, rdf.type, dash.SingleEditor)
  yield $rdf.quad(starRating, rdfs.label, $rdf.literal('Star rating'))
}

configure(({ editors }) => {
  editors.addMetadata(metadata)
})
