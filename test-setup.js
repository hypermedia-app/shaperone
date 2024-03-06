/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
require('chai-snapshot-matcher')

const chaiQuantifiers = require('chai-quantifiers')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiSubset = require('chai-subset')

chai.use(sinonChai)
chai.use(chaiQuantifiers)
chai.use(chaiSubset)
