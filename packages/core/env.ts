import type { Environment } from '@rdfjs/environment/Environment.js'
import E, { DerivedEnvironment } from '@zazuko/env-core'
import type ClownfaceFactory from 'clownface/Factory.js'
import type { DataFactory, DatasetCoreFactory } from '@rdfjs/types'
import type NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import type { TermMapFactory } from '@rdfjs/term-map/Factory.js'
import { CombinedEnvironment } from '@zazuko/env-core/lib/extend.js'
import { RdfineFactory } from '@tpluscode/rdfine/environment'
import { ShFactory } from '@rdfine/shacl/Factory'
import PropertyShapeEx from './models/shapes/lib/PropertyShape.js'
import Sh1NamespaceFactory from './lib/env/NamespaceFactory.js'
import ConstantsFactory from './lib/env/ConstantsFactory.js'
import deps from './lib/mixins.js'

export type MiminalEnvironment = Environment<
ClownfaceFactory |
DataFactory |
DatasetCoreFactory |
NsBuildersFactory |
TermMapFactory>

export interface Requirements {
  _core: MiminalEnvironment
}

type ValuesArray<R extends Record<string, any>> = R[keyof R][];

export type RequiredEnvironment = CombinedEnvironment<ValuesArray<Requirements>>

export type ShaperoneEnvironment = DerivedEnvironment<
Environment<Sh1NamespaceFactory | RdfineFactory | ShFactory | ConstantsFactory>,
RequiredEnvironment>

let instance: ShaperoneEnvironment | undefined

export default function getEnv(): ShaperoneEnvironment {
  if (!instance) {
    throw new Error('Environment not initialized')
  }

  return instance
}

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
