import Environment from '@zazuko/env/Environment'
import alcaeus from 'alcaeus/Factory'
import $rdf from '@rdfine/env'
import FetchFactory from '@rdfjs/fetch-lite/Factory.js'

export default new Environment([alcaeus(), FetchFactory], { parent: $rdf })
