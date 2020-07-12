import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import { sh, schema, xsd, rdfs, dash, foaf, vcard } from '@tpluscode/rdf-ns-builders'
import { turtle } from '@tpluscode/rdf-string'
import { DatasetCore } from 'rdf-js'
import type { Store } from '../store'
import { Menu, updateMenu } from '../../menu'
import { serialize } from '../../serializer'

const context = [
  'https://raw.githubusercontent.com/w3c/shacl/master/shacl-jsonld-context/shacl.context.ld.json',
  {
    schema: schema().value,
    ex: 'http://example.com/',
  },
]

const triples = turtle`@prefix ex: <http://example.com/> .
@prefix lexvo: <http://lexvo.org/id/iso639-1/> .

ex:PersonShape
  a ${sh.Shape} ;
  ${sh.targetClass} ${schema.Person} ;
  ${rdfs.label} "Person" ;
  ${sh.property} ex:NameProperty ,
                 ex:KnowsProperty ,
                 ex:AgeProperty ,
                 ex:GenderProperty ,
                 ex:SpokenLanguagesProperty ;
.

ex:SimplifiedPersonShape
  a ${sh.Shape} ;
  ${sh.targetClass} ${schema.Person} ;
  ${rdfs.label} "Person (name-only)" ;
  ${sh.property} ex:NameProperty ;
.

ex:NameProperty
  ${sh.path} ${schema.name} ;
  ${sh.name} "Name" ;
  ${sh.datatype} ${xsd.string} ;
  ${dash.singleLine} true ;
  ${sh.maxCount} 1 ;
  ${sh.minCount} 1 ;
  ${sh.order} 1 ;
.

ex:KnowsProperty
  ${sh.path} ${schema.knows} ;
  ${sh.class} ${schema.Person} ;
  ${sh.node} ex:SimplifiedPersonShape ;
  ${sh.group} ex:FriendGroup ;
.

ex:AgeProperty
  ${sh.path} ${schema.age} ;
  ${sh.name} "Age" ;
  ${sh.datatype} ${xsd.integer} ;
  ${sh.maxCount} 1 ;
  ${sh.defaultValue} 21 ;
  ${sh.order} 2 ;
.

ex:GenderProperty
  ${sh.path} ${foaf.gender} ;
  ${sh.name} "Gender" ;
  ${sh.in} (
    "Male" "Female" "Other" "Prefer not to tell"
  ) ;
  ${sh.maxCount} 1 ;
  ${sh.order} 3 ;
  ${dash.editor} ${dash.EnumSelectEditor} ;
.

ex:SpokenLanguagesProperty
  ${sh.path} ${vcard.language} ;
  ${sh.name} "Spoken languages" ;
  ${sh.in} (
    lexvo:en lexvo:de lexvo:fr lexvo:pl lexvo:es
  ) ;
  ${sh.order} 4 ;
.

ex:FriendGroup
  a ${sh.PropertyGroup} ;
  ${rdfs.label} "Acquaintances"
.

lexvo:en ${rdfs.label} "English" .
lexvo:de ${rdfs.label} "German" .
lexvo:fr ${rdfs.label} "French" .
lexvo:pl ${rdfs.label} "Polish" .
lexvo:es ${rdfs.label} "Spanish" .`

export interface State {
  serialized: string
  format: string
  dataset?: DatasetCore
  menu: Menu
}

export const shape = createModel({
  state: <State>{
    serialized: triples.toString(),
    format: 'text/turtle',
    menu: {
      text: 'Format',
      children: [{
        type: 'format',
        text: 'application/ld+json',
      }, {
        type: 'format',
        text: 'text/turtle',
        checked: true,
      }],
    },
  },
  reducers: {
    setShape(state, dataset: DatasetCore) {
      return {
        ...state,
        dataset,
      }
    },
    serialized(state, serialized: string): State {
      return {
        ...state,
        serialized,
      }
    },
    format(state, format: string) {
      return {
        ...state,
        format,
        menu: updateMenu(state.menu, 'format', format),
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.dispatch()

    return {
      async parse() {
        const { shape } = store.getState()

        const stream = parsers.import(shape.format, toStream(shape.serialized), {
          context,
        })
        if (!stream) {
          throw new Error('Failed to parse shape')
        }

        const dataset = await $rdf.dataset().import(stream)

        dispatch.shape.setShape(dataset)
      },

      async serialize(dataset: DatasetCore) {
        const { shape } = store.getState()

        dispatch.shape.serialized(await serialize(dataset, shape.format, {
          context: {
            '@context': context,
            '@type': 'Shape',
            '@embed': '@always',
          },
          compact: true,
          frame: true,
          skipContext: true,
        }))
      },

      async changeFormat({ format }: { format: Menu }) {
        const { shape } = store.getState()

        dispatch.shape.format(format.text)

        if (shape.dataset) {
          dispatch.shape.serialize(shape.dataset)
        }
      },
    }
  },
})
