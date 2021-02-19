import { fromPointer } from '@rdfine/shacl/lib/NodeShape'
import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import { schema } from '@tpluscode/rdf-ns-builders'
import RdfResource from '@tpluscode/rdfine'
import { NodeShapeBundle, PropertyShapeBundle } from '@rdfine/shacl/bundles'

RdfResource.factory.addMixin(...NodeShapeBundle)
RdfResource.factory.addMixin(...PropertyShapeBundle)

export const simplePerson = fromPointer(
  clownface({ dataset: dataset() }).blankNode(),
  {
    property: [
      {
        path: schema.name,
        name: 'Name',
        minCount: 1,
      },
    ],
  },
)
