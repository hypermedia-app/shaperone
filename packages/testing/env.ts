import Environment from '@zazuko/env/Environment.js'
import parent from '@rdfine/env'
import alcaeus from 'alcaeus/Factory.js'
import { ShFactory } from '@rdfine/shacl/Factory'
import { HydraFactory } from '@rdfine/hydra/Factory'
import ConstantsFactory from '@hydrofoil/shaperone-core/lib/env/ConstantsFactory'

export default new Environment([ShFactory, HydraFactory, ConstantsFactory, alcaeus()], { parent })
