import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import cf, { Clownface, SingleContextClownface } from 'clownface'
import { schema } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdfjs/term-set'
import { Shape } from '@rdfine/shacl'
import { DatasetCore } from 'rdf-js'
import type { ComboBoxElement } from '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { Store } from '../store'
import { Menu, updateComponent, updateMenu } from '../../menu'
import { serialize } from '../../serializer'

import '@vaadin/vaadin-combo-box/vaadin-combo-box'

const jsonld = {
  '@context': {
    '@vocab': schema().value,
    ex: 'http://example.com/',
  },
  '@id': 'ex:John_Doe',
  '@type': 'Person',
  name: 'John Doe',
  knows: {
    '@id': 'ex:Jane_Doe',
    '@type': 'Person',
    name: 'Janet',
  },
}

export interface State {
  graph?: Clownface
  pointer?: SingleContextClownface
  format: string
  serialized: string
  context: Record<string, any>
  menu: Menu[]
  resourceSelector?: ComboBoxElement
}

function createResourcesMenu() {
  const comboBox = document.createElement('vaadin-combo-box') as ComboBoxElement

  comboBox.addEventListener('selected-item-changed', (e: any) => {
    comboBox.dispatchEvent(new CustomEvent('resource-selected', {
      detail: e.detail,
      bubbles: true,
      composed: true,
    }))
  })

  return comboBox
}

const pipeline = `@base <urn:pipeline:sbb-cff-ffs> .
@prefix : <https://pipeline.described.at/> .
@prefix code: <https://code.described.at/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix ex: <http://example.com/> .



_:common-vars :variable
  [ a :Variable; :name "sourceDir"; :value "source"; :envVariable "MAPPING" ] ,
  [ a :Variable; :name "targetDir"; :value "target" ] .

_:nova-vars :variable
        [ a :Variable; :name "mappings"; :value "src-gen/mapping-nova-*.meta.json" ] ,
        [ a :Variable; :name "graph"; :value "https://lindas.admin.ch/sbb/nova" ] .

_:didok-vars :variable
        [ a :Variable; :name "csvw"; :value "src-gen/mapping-didok.csv.meta.json" ] ,
        [ a :Variable; :name "graph"; :value "https://lindas.admin.ch/sbb/didok" ] ,
        [ a :Variable; :name "url"; :value "foo" ] .

# ------------------------------
#
# Root pipeline
#
# Entire workflow: download, extract and process files
#
# ------------------------------

<#GenericWebStepsFile> :stepList ( <#get> <#parse> <#filterNotCsvw> <#serialize> <#save>) .
<#GenericWebSteps> :stepList ( <#get> <#parse> <#filterNotCsvw> <#setGraph> <#upload>) .

<#GenericLocalStepsFile> :stepList ( <#readDir> <#doTransform> <#filterNotCsvw> <#serialize> <#save>) .
<#GenericLocalSteps> :stepList ( <#readDir> <#doTransform> <#filterNotCsvw> <#setGraph> <#upload>) .



<#RootDidokFile> a :Pipeline;
  :steps <#GenericWebStepsFile> ;
  :variables _:common-vars, _:didok-vars .

<#RootDidok> a :Pipeline;
  :steps <#GenericWebSteps> ;
  :variables _:common-vars, _:didok-vars .

## This is the default pipeline for the NOVA files in the local filesystem, synced from FTP server
<#RootNovaFile> a :Pipeline;
  :steps <#GenericLocalStepsFile> ;
  :variables _:common-vars, _:nova-vars .

<#RootNova> a :Pipeline;
  :steps <#GenericLocalStepsFile>;
  :variables  _:common-vars, _:nova-vars .

# ------------------------------
#
# Download pipeline
#
# Downloads the zip and extracts contents to \${sourceDir}
#
# ------------------------------

<#get> a :Step ;
  code:implementedBy
    [
      code:link <node:barnard59-http#get> ;
      a code:EcmaScript
    ] ;
  code:arguments [
    code:name "url";
    code:value "url"^^:VariableName
  ].

<#Download-Sources> a :Pipeline, :Readable ;
  :steps
    [
      :stepList ( <#downloadSftp> <#extract> )
    ] ;
  :variables
    [
      :variable [ a :Variable; :name "sourceUrl"; :value "http://ktk.netlabs.org/misc/rdf/InfoSM.zip" ]
    ],
    _:common-vars .

<#fetch> a :Step ;
  code:implementedBy
    [
      code:link <node:barnard59-base#fetch> ;
      a code:EcmaScript
    ] ;
  code:arguments (
    "\${sourceUrl}"^^code:EcmaScriptTemplateLiteral
  ).

<#downloadSftp> a :Step ;
  code:implementedBy
    [
      code:link <node:barnard59-ftp#read> ;
      a code:EcmaScript
    ] ;
  code:arguments [
    code:name "protocol";
    code:value "sftp"
  ], [
    code:name "user";
    code:value "isceco-pr"
  ], [
    code:name "host";
    code:value "sftp.zazukoians.org"
  ], [
    code:name "filename";
    code:value "/upload/InfoSM.zip"
  ], [
    code:name "privateKey";
    code:value "${process.env.SSH_PRIVATE_KEY}"^^code:EcmaScriptTemplateLiteral
  ].

<#extract> a :Step ;
  code:implementedBy
    [
      code:link <file:../lib/zip#extract> ;
      a code:EcmaScript
    ] ;
  code:arguments (
    "sourceDir"^^:VariableName
  ).

# ------------------------------
#
# Transform pipeline
#
# One-by-one parses and transforms the source csv files to RDF
#
# ------------------------------

<#TransformFiles> a :Pipeline, :ReadableObjectMode;
  :steps [
#      :stepList ( <#readDir> <#doTransform> <#sparqlInsert> <#serialize> <#save>)
      :stepList ( <#readDir> <#doTransform> )

    ] ;
  :variables _:common-vars .

<#ToGraphStore> a :Pipeline, :Readable;
  :steps [
      :stepList ( <#setGraph> <#upload> )

    ] ;
  :variables _:common-vars .

<#ToFile> a :Pipeline, :WritableObjectMode ;
  :steps [
      :stepList ( <#serialize> <#save>  )

    ] ;
  :variables _:common-vars .

<#readDir> a :Step ;
  code:implementedBy
    [
      code:link <node:barnard59-base#glob> ;
      a code:EcmaScript
    ] ;
  code:arguments [
    code:name  "pattern" ;
    code:value "mappings"^^:VariableName
   ] .

<#doTransform> a :Step ;
  code:implementedBy [
      code:link <node:barnard59-core#forEach> ;
      a code:EcmaScript
    ] ;
  code:arguments (
    <#TransformCsv>
    "(p, fileName) => { p.variables.set('csvw', fileName) }"^^code:EcmaScript
  ) .

# ------------------------------
#
# Transforms individual files
#
# ------------------------------

<#TransformCsv> a :Pipeline, :ReadableObjectMode ;
  :steps
    [
#      :stepList ( <#openCsv> <#parse> <#filterNotCsvw> )
      :stepList ( <#openCsv> <#parse> <#filterNotCsvw> <#slugUris> )
    ] ;
  :variables _:common-vars.

<#openCsv> a :Step ;
  code:implementedBy [
      code:link <file:../lib/csv#openFromCsvw> ;
      a code:EcmaScript
    ] ;
  code:arguments ( "\${csvw}"^^code:EcmaScriptTemplateLiteral ) .

<#parse> a :Step;
  code:implementedBy
    [
      code:link <node:barnard59-formats#csvw.parse>;
      a code:EcmaScript
    ];
  code:arguments ( <#parseMetadata> ).

<#parseMetadata> a :Pipeline, :ReadableObjectMode;
  :steps
    [
      :stepList ( <#readMetadata> <#parseMetadataStep> )
    ].

<#readMetadata> a :Step;
  code:implementedBy
    [
      code:link <node:fs#createReadStream>;
      a code:EcmaScript
    ];
  code:arguments ("\${csvw}"^^code:EcmaScriptTemplateLiteral).

<#parseMetadataStep> a :Step;
  code:implementedBy
    [
      code:link <node:barnard59-formats#jsonld.parse>;
      a code:EcmaScript
    ].

<#municipalityLookup> a :Step ;
  code:implementedBy
    [
      code:link <node:barnard59-base#map> ;
      a code:EcmaScript
    ] ;
  code:arguments (
    [
      code:link <file:../lib/municipality-lookup.js> ;
      a code:EcmaScript
    ]
  ) .

<#filterNotCsvw> a :Step;
  code:implementedBy [ a code:EcmaScript;
    code:link <node:barnard59-base#filter>
 ];
 code:arguments ( """quad => {
  if (quad.predicate.value.startsWith('http://www.w3.org/ns/csvw#')) {
\t return false
\t}
\tif (quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' && quad.object.value.startsWith('http://www.w3.org/ns/csvw#')) {
\t return false
\t}
\treturn true
\t}"""^^code:EcmaScript ).

# TODO why does that not work separately? Had to put the filter above
<#filterRelativeIris> a :Step;
  code:implementedBy [ a code:EcmaScript;
    code:link <node:barnard59-base#filter>
 ];
 code:arguments ( """quad => {
  if (quad.predicate.value.startsWith('#')) {
\t return false
\t}
\treturn true
\t}"""^^code:EcmaScript ).

<#fixCantonCase> a :Step ;
  code:implementedBy [
    code:link <node:barnard59-base#map> ;
    a code:EcmaScript
  ];
  code:arguments ( """quad => {
      const rdf = require('rdf-ext')
      if (quad.predicate.value !== 'http://ld.zazuko.com/animalpest/attribute/canton') {
        return quad
      }

      return rdf.quad(quad.subject, quad.predicate, rdf.namedNode(quad.object.value.toLowerCase()))
    }"""^^code:EcmaScript) .

<#slugUris> a :Step ;
  code:implementedBy [
    code:link <node:barnard59-base#map> ;
    a code:EcmaScript
  ];
  code:arguments ( """quad => {
  const { URL } = require('url')
  const urlSlug = require('url-slug')
  const rdf = require('rdf-ext')

  if (quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
    return rdf.quad(fixNamedNode(quad.subject), quad.predicate, quad.object, quad.graph)
  }
  return rdf.quad(fixNamedNode(quad.subject), quad.predicate, fixNamedNode(quad.object), quad.graph)

  function fixNamedNode (term) {
    if (term.termType !== 'NamedNode') {
      return term
    }
    if (term.value.startsWith('http://lod.opentransportdata.swiss/vocab/')) {
      return term
    }
    if (term.value.startsWith('http://schema.org/')) {
      return term
    }

    const url = new URL(term.value)

    url.pathname = url.pathname
      .split('/')
      .map((part) => urlSlug(decodeURIComponent(part)))
      .join('/')

    return rdf.namedNode(url.toString())
  };
}"""^^code:EcmaScript) .

<#sparqlInsert> a :Step;
  code:implementedBy [ a code:EcmaScript;
    code:link <node:barnard59-tdb#update>
  ];
  code:arguments [
    code:name "queries";
    code:value (
      "require('fs').readFileSync('sparql/extra_municipality2currentname.rq').toString()"^^code:EcmaScript
      "require('fs').readFileSync('sparql/extra_cantonname.rq').toString()"^^code:EcmaScript
    )
  ].

<#serialize> a :Step;
  code:implementedBy
    [
      code:link <node:barnard59-formats#ntriples.serialize> ;
      a code:EcmaScript
    ].

<#save> a :Step;
  code:implementedBy
    [
      code:link <node:fs#createWriteStream>;
      a code:EcmaScript
    ];
  code:arguments ("\${targetDir}/everything.nt"^^code:EcmaScriptTemplateLiteral).

<#setGraph> a :Step;
  code:implementedBy [ a code:EcmaScript;
    code:link <node:barnard59-base#setGraph>
  ];
  code:arguments ( "graph"^^:VariableName ).

<#upload> a :Step;
  code:implementedBy [ a code:EcmaScript;
    code:link <node:barnard59-graph-store#put>
  ];
  code:arguments [
    code:name "endpoint";
    code:value "endpoint"^^:VariableName
  ], [
    code:name "user";
    code:value "user"^^:VariableName
  ], [
    code:name "password";
    code:value "password"^^:VariableName
  ].

`

export const resource = createModel({
  state: <State>{
    serialized: pipeline,
    format: 'text/turtle',
    context: {},
    menu: [{
      text: 'Resource',
      children: [{
        id: 'resource selector',
      }],
    }, {
      text: 'Format',
      children: [{
        type: 'format',
        text: 'application/ld+json',
        checked: true,
      }, {
        type: 'format',
        text: 'text/turtle',
      }],
    }],
  },
  reducers: {
    replaceGraph(state, { graph }: { graph: Clownface }) {
      const pointers = graph.in().filter(node => node.term.termType === 'NamedNode')
      const terms = new TermSet(pointers.map(node => node.term))
      let pointer
      const resourceSelector = state.resourceSelector || createResourcesMenu()

      if (!state.pointer) {
        pointer = graph.node($rdf.namedNode('urn:pipeline:sbb-cff-ffs#RootDidok'))
      } else {
        pointer = graph.node(state.pointer.term)
      }

      resourceSelector.items = [...terms].map(node => node.value)
      resourceSelector.selectedItem = pointer.value
      return {
        ...state,
        graph,
        pointer,
        menu: state.menu.map(item => updateComponent(item, 'resource selector', resourceSelector)),
      }
    },
    selectResource(state, { id }: { id: string }) {
      if (id === state.pointer?.value) {
        return state
      }

      const { resourceSelector } = state
      if (resourceSelector) {
        resourceSelector.selectedItem = id
      }

      return {
        ...state,
        pointer: state.graph?.namedNode(id),
      }
    },
    serialized(state, serialized: string): State {
      return {
        ...state,
        serialized,
      }
    },
    context(state, context: Record<string, any>) {
      return {
        ...state,
        context,
      }
    },
    format(state, format: string) {
      return {
        ...state,
        format,
        menu: state.menu.map(item => updateMenu(item, 'format', format)),
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.dispatch()
    return {
      async parse() {
        const { resource } = store.getState()

        const stream = parsers.import(resource.format, toStream(resource.serialized))
        if (!stream) {
          throw new Error('Failed to parse resource')
        }

        if (resource.format === 'application/ld+json') {
          try {
            const jsonld = JSON.parse(resource.serialized)
            dispatch.resource.context(jsonld['@context'])
            // eslint-disable-next-line no-empty
          } catch (e) {
          }
        }

        const dataset = await $rdf.dataset().import(stream)

        dispatch.resource.replaceGraph({
          graph: cf({ dataset }),
        })
      },

      async serialize({ dataset, shape } : { dataset: DatasetCore; shape: Shape }) {
        const { resource } = store.getState()

        dispatch.resource.serialized(await serialize(dataset, resource.format, {
          context: {
            '@context': { ...resource.context },
            '@type': shape.targetClass.id.value,
            '@embed': '@always',
          },
          compact: true,
          frame: true,
        }))
      },

      async changeFormat({ format, shape }: { format: Menu; shape?: Shape }) {
        const { resource } = store.getState()

        dispatch.resource.format(format.text)

        if (resource.pointer && shape) {
          dispatch.resource.serialize({
            dataset: resource.pointer.dataset,
            shape,
          })
        }
      },
    }
  },
})
