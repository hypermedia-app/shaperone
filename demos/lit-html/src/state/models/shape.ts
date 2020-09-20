import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import { sh, schema, xsd, rdfs, dash, foaf, vcard } from '@tpluscode/rdf-ns-builders'
import { turtle } from '@tpluscode/rdf-string'
import { DatasetCore, Quad } from 'rdf-js'
import { Menu, updateMenu } from '../../menu'

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
                 ex:SpokenLanguagesProperty  ,
                 ex:DateOfBirthProperty ;
.

ex:SimplifiedPersonShape
  a ${sh.Shape} ;
  ${sh.targetNode} ex:Jane_Doe ;
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
.

ex:DateOfBirthProperty
  ${sh.path} ${schema.birthDate} ;
  ${sh.name} "Date of birth" ;
  ${sh.maxCount} 1 ;
  ${sh.order} 4 ;
  ${sh.datatype} ${xsd.date} ;
.

ex:SpokenLanguagesProperty
  ${sh.path} ${vcard.language} ;
  ${sh.name} "Spoken languages" ;
  ${sh.nodeKind} ${sh.IRI} ;
  ${sh.in} (
    lexvo:en lexvo:de lexvo:fr lexvo:pl lexvo:es
  ) ;
  ${sh.order} 5 ;
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
    setShape(state, quads: Quad[]) {
      const dataset = $rdf.dataset(quads)
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
})
