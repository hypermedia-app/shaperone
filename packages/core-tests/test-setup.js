import 'chai-snapshot-matcher'
import chaiQuantifiers from 'chai-quantifiers'
import * as chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiSubset from 'chai-subset'
import { setEnv } from '@hydrofoil/shaperone-core/env.js'
import rdf from '@zazuko/env'

chai.use(sinonChai)
chai.use(chaiQuantifiers)
chai.use(chaiSubset)

export const mochaHooks = {
  beforeAll() {
    setEnv(rdf)
  },
}
