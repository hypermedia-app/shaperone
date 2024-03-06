import Environment from '@zazuko/env-core'
import { RdfineFactory } from '@tpluscode/rdfine/environment.js'
import { ShFactory } from '@rdfine/shacl/Factory'
import NamespaceFactory from './NamespaceFactory.js'
import ConstantsFactory from './ConstantsFactory.js'

export default new Environment([NamespaceFactory, ConstantsFactory, RdfineFactory, ShFactory])
