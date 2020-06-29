import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import { sh, schema, xsd, rdfs, dash } from '@tpluscode/rdf-ns-builders'
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

const triples = turtle`@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix schema: <http://schema.org/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix shsh: <http://www.w3.org/ns/shacl-shacl#> .

@prefix p: <https://pipeline.described.at/> .
@prefix code: <https://code.described.at/> .
@prefix ex: <http://example.com/> .

ex:PipelineShape
  a sh:NodeShape ;
  sh:targetClass p:Pipeline ;
  rdfs:label "Pipeline" ;
  sh:property [
    sh:path p:steps ;
    sh:name "Steps" ;
    sh:node ex:StepListShape ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path p:variables ;
    sh:name "Variable sets" ;
    sh:node ex:VariableSetShape ;
            sh:nodeKind sh:BlankNodeOrIRI
  ]
.

shsh:ListShape
  a sh:NodeShape ;
  rdfs:label "List shape"@en ;
  rdfs:comment "A shape describing well-formed RDF lists. Currently does not check for non-recursion. This could be expressed using SHACL-SPARQL."@en ;
  rdfs:seeAlso <https://www.w3.org/TR/shacl/#syntax-rule-SHACL-list> ;
  sh:property [
    sh:path [ sh:zeroOrMorePath rdf:rest ] ;
    rdfs:comment "Each list member (including this node) must be have the shape shsh:ListNodeShape."@en ;
    sh:hasValue rdf:nil ;
    sh:node shsh:ListNodeShape ;
  ] .


shsh:ListNodeShape
  a sh:NodeShape ;
  rdfs:label "List node shape"@en ;
  rdfs:comment "Defines constraints on what it means for a node to be a node within a well-formed RDF list. Note that this does not check whether the rdf:rest items are also well-formed lists as this would lead to unsupported recursion."@en ;
  sh:or ( [
        sh:hasValue rdf:nil ;
            sh:property [
          sh:path rdf:first ;
          sh:maxCount 0 ;
        ] ;
        sh:property [
          sh:path rdf:rest ;
          sh:maxCount 0 ;
        ] ;
      ]
      [
        sh:not [ sh:hasValue rdf:nil ] ;
        sh:property [
          sh:path rdf:first ;
                    sh:node ex:StepShape ;
          sh:maxCount 1 ;
          sh:minCount 1 ;
        ] ;
        sh:property [
          sh:path rdf:rest ;
          sh:maxCount 1 ;
          sh:minCount 1 ;
        ] ;
      ] ) .

ex:StepShape
  a sh:NodeShape ;
  sh:targetClass p:Step ;
  sh:property [
    sh:name "Implementation" ;
    sh:path code:implementedBy ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
  ] ;
  sh:property [
    sh:name "Arguments" ;
    sh:path code:arguments ;
    sh:or (
      [ sh:node ex:PositionalArgumentsShape ]
      [ sh:node ex:NamedArgumentsShape ]
    )
  ] ;
.

ex:VariableSetShape
  a sh:NodeShape ;
  rdfs:label "Variable set" ;
  sh:property [
    sh:path p:variable ;
    sh:name "Variable" ;
    sh:node ex:VariableShape ;
    sh:nodeKind sh:BlankNode
  ]
.

ex:VariableShape
  a sh:NodeShape ;
  rdfs:label "Variable" ;
  sh:targetClass p:Variable ;
  sh:property [
    sh:name "Name" ;
    sh:path p:name ;
    ${dash.singleLine} true ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:name "Value" ;
    sh:path p:value ;
    sh:minCount 1 ;
    sh:maxCount 1
  ]
.

ex:EcmaScriptShape
  a sh:NodeShape ;
  sh:targetClass code:EcmaScript ;
  sh:property [
    sh:path code:link ;
    sh:nodeKind sh:IRI ;
    sh:minCount 1 ;
    sh:maxCount 1
  ]
.`

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
