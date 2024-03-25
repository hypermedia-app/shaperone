import Environment from '@zazuko/env/Environment.js'
import { ShFactory } from '@rdfine/shacl/Factory'
import { HydraFactory } from '@rdfine/hydra/Factory'
import ConstantsFactory from '@hydrofoil/shaperone-core/lib/env/ConstantsFactory.js'
import Sh1NamespaceFactory from '@hydrofoil/shaperone-core/lib/env/NamespaceFactory.js'
import DataFactory from '@rdfjs/data-model/Factory.js'
import DatasetFactory from '@rdfjs/dataset/Factory.js'
import NamespaceFactory from '@rdfjs/namespace/Factory.js'
import ClownfaceFactory from 'clownface/Factory.js'
import { RdfineFactory } from '@tpluscode/rdfine/environment'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import TermMapFactory from '@rdfjs/term-map/Factory.js'
import TermSetFactory from '@rdfjs/term-set/Factory.js'
import FormatsFactory from '@rdfjs/formats/Factory.js'
import alcaeus from './HydraFactory.js'

export default new Environment([
  DataFactory,
  RdfineFactory,
  NsBuildersFactory,
  TermMapFactory,
  TermSetFactory,
  DatasetFactory,
  NamespaceFactory,
  ClownfaceFactory,
  ShFactory,
  HydraFactory,
  ConstantsFactory,
  alcaeus,
  Sh1NamespaceFactory,
  FormatsFactory,
])
