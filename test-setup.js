/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
require('@babel/register')({
  configFile: './babel.config.json',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
})

require('chai-snapshot-matcher')

const RdfResource = require('@tpluscode/rdfine/RdfResource').default
const Shacl = require('@rdfine/shacl')
const chaiQuantifiers = require('chai-quantifiers')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiSubset = require('chai-subset')

chai.use(sinonChai)
chai.use(chaiQuantifiers)
chai.use(chaiSubset)

RdfResource.factory.addMixin(...Object.values(Shacl))
