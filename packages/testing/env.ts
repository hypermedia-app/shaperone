import Environment from '@zazuko/env/Environment.js'
import parent from '@rdfine/env'
import alcaeus from 'alcaeus/Factory.js'
import { ShFactory } from '@rdfine/shacl/Factory'
import { HydraFactory } from '@rdfine/hydra/Factory'
import ConstantsFactory from '@hydrofoil/shaperone-core/lib/env/ConstantsFactory.js'
import Sh1NamespaceFactory from '@hydrofoil/shaperone-core/lib/env/NamespaceFactory.js'

export default new Environment([ShFactory, HydraFactory, ConstantsFactory, alcaeus(), Sh1NamespaceFactory], { parent })
