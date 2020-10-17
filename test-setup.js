/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const RdfResource = require('@tpluscode/rdfine/RdfResource').default
const Shacl = require('@rdfine/shacl')
const chaiQuantifiers = require('chai-quantifiers')
const chai = require('chai')

chai.use(chaiQuantifiers)

RdfResource.factory.addMixin(...Object.values(Shacl))
