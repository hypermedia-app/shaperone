import type { Environment } from '@rdfjs/environment/Environment.js'
import type { DerivedEnvironment } from '@zazuko/env-core'
import E from '@zazuko/env-core'
import type { DatasetFactoryExt } from '@zazuko/env/lib/DatasetFactoryExt.js'
import type ClownfaceFactory from 'clownface/Factory.js'
import type { DataFactory } from '@rdfjs/types'
import type NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import type { TermMapFactory } from '@rdfjs/term-map/Factory.js'
import type { CombinedEnvironment } from '@zazuko/env-core/lib/extend.js'
import { RdfineFactory } from '@tpluscode/rdfine/environment'
import { ShFactory } from '@rdfine/shacl/Factory'
import PropertyShapeEx from './models/shapes/lib/PropertyShape.js'
import Sh1NamespaceFactory from './lib/env/NamespaceFactory.js'
import ConstantsFactory from './lib/env/ConstantsFactory.js'
import deps from './lib/mixins.js'

export type MinimalEnvironment = Environment<
ClownfaceFactory |
DataFactory |
DatasetFactoryExt |
NsBuildersFactory |
TermMapFactory>

export interface Requirements {
  _core: MinimalEnvironment
}

type ValuesArray<R extends Record<string, any>> = R[keyof R][];

export type RequiredEnvironment = CombinedEnvironment<ValuesArray<Requirements>>

export type ShaperoneEnvironment = DerivedEnvironment<
Environment<Sh1NamespaceFactory | RdfineFactory | ShFactory | ConstantsFactory>,
RequiredEnvironment>

let instance: ShaperoneEnvironment

export function setEnv(parent: RequiredEnvironment) {
  let newEnv: ShaperoneEnvironment

  if (isShaperoneEnvironment(parent)) {
    newEnv = parent
  } else {
    newEnv = new E([Sh1NamespaceFactory, ConstantsFactory, RdfineFactory, ShFactory], { parent })
  }

  newEnv.rdfine().factory.addMixin(PropertyShapeEx)
  deps.forEach((mixin) => {
    newEnv.rdfine().factory.addMixin(mixin)
  })

  instance = newEnv
}

function isShaperoneEnvironment(env: RequiredEnvironment): env is ShaperoneEnvironment {
  return 'sh1' in env.ns
}

export default () => instance
