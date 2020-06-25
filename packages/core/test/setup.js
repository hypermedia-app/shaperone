/* eslint-disable @typescript-eslint/no-var-requires */
const RdfResource = require('@tpluscode/rdfine/RdfResource').default
const Shacl = require('@rdfine/shacl')

RdfResource.factory.addMixin(...Object.values(Shacl))
