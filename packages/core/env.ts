import type { Environment } from '@rdfjs/environment/Environment'
import type ClownfaceFactory from 'clownface/Factory'
import type { DataFactory, DatasetCoreFactory } from '@rdfjs/types'
import type { NsBuildersFactory } from '@tpluscode/rdf-ns-builders/Factory.js'
import type { TermMapFactory } from '@rdfjs/term-map/Factory.js'
import type { DerivedEnvironment } from '@zazuko/env-core'
import { CombinedEnvironment } from '@zazuko/env-core/lib/extend'
import type env from './lib/env/index.js'

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

export type ShaperoneEnvironment = DerivedEnvironment<typeof env, RequiredEnvironment>
