import { testPropertyState } from '@shaperone/testing/models/form.js'
import $rdf from '@zazuko/env/web.js'
import { propertyShape } from '@shaperone/testing/util.js'
import { hydra } from '@tpluscode/rdf-ns-builders'
import { ex } from '@shaperone/testing'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import type { IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms'

export function hydraCollectionProperty(): PropertyState {
  const property = testPropertyState($rdf.clownface().blankNode())

  property.shape = propertyShape({
    [hydra.collection.value]: ex.Collection,
  })

  return property
}

export function hydraSearchProperty({ search = {} }: { search?: Initializer<IriTemplate> } = {}): PropertyState {
  const property = testPropertyState($rdf.clownface().blankNode())

  property.shape = propertyShape({
    [hydra.search.value]: {
      types: [hydra.IriTemplate],
      ...search,
    },
  })

  return property
}
