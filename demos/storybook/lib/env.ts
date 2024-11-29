import Environment from '@zazuko/env/Environment.js'
import FetchFactory from '@rdfjs/fetch-lite/Factory.js'
import rdf from '@zazuko/env'
import formats from '@rdfjs-elements/formats-pretty'

const env = new Environment([FetchFactory], { parent: rdf })

env.formats.import(formats)
export default env
