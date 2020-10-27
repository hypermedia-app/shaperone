import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import { sh, schema, xsd, rdfs, dash, foaf, vcard, rdf } from '@tpluscode/rdf-ns-builders'
import { turtle } from '@tpluscode/rdf-string'
import { DatasetCore, Quad } from 'rdf-js'
import { TextFieldElement } from '@vaadin/vaadin-text-field/vaadin-text-field'
import * as formats from '@rdf-esm/formats-common'
import rdfFetch from '@rdfjs/fetch-lite'
import clownface from 'clownface'
import { Menu, updateMenu } from '../../menu'
import type { Store } from '../store'

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
  quads: Quad[]
  menu: Menu[]
}

const fetchShapeMenu = (() => {
  import('@vaadin/vaadin-button/vaadin-button.js')
  import('@vaadin/vaadin-checkbox/vaadin-checkbox.js')

  const fetchShapeInput = document.createElement('vaadin-text-field') as TextFieldElement
  fetchShapeInput.placeholder = 'Shapes URL'

  const authHeaderInput = document.createElement('vaadin-text-field') as TextFieldElement
  authHeaderInput.placeholder = '(Optional) Authorization header'

  const clearResource = document.createElement('vaadin-checkbox')
  clearResource.innerText = 'Clear resource graph'

  const fetchShapeButton = document.createElement('vaadin-button')
  fetchShapeButton.innerText = 'Fetch shape'
  fetchShapeButton.addEventListener('click', (e) => {
    const authorization = authHeaderInput.value ? `Bearer ${authHeaderInput.value}` : ''

    e.target?.dispatchEvent(new CustomEvent('shape-load', {
      detail: {
        shape: fetchShapeInput.value,
        authorization,
        clearResource: clearResource.checked,
      },
      bubbles: true,
      composed: true,
    }))
  })

  return [{
    component: fetchShapeInput,
  }, {
    component: authHeaderInput,
  }, {
    component: clearResource,
  }, {
    component: fetchShapeButton,
  }]
})()

const toolsMenu = (() => {
  import('@vaadin/vaadin-button/vaadin-button.js')

  const generateInstancesButton = document.createElement('vaadin-button')
  generateInstancesButton.innerText = 'Generate dummy instances'
  generateInstancesButton.addEventListener('click', () => {
    generateInstancesButton.dispatchEvent(new CustomEvent('generate-instances', {
      composed: true,
      bubbles: true,
    }))
  })

  return [{
    component: generateInstancesButton,
  }]
})()

export const shape = createModel({
  state: <State>{
    serialized: triples.toString(),
    format: 'text/turtle',
    menu: [{
      text: 'Format',
      children: [{
        type: 'format',
        text: 'application/ld+json',
      }, {
        type: 'format',
        text: 'text/turtle',
        checked: true,
      }],
    }, {
      text: 'Fetch shape',
      children: fetchShapeMenu,
    }, {
      text: 'Tools',
      children: toolsMenu,
    }],
  },
  reducers: {
    setShape(state, quads: Quad[]) {
      const dataset = $rdf.dataset(quads)
      return {
        ...state,
        dataset,
        quads,
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
        menu: state.menu.map(item => updateMenu(item, 'format', format)),
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      async loadShape({ shape, authorization, clearResource }: { shape: string; authorization: string; clearResource: boolean }) {
        const shapes = await rdfFetch(shape, {
          formats: formats as any,
          factory: $rdf,
          headers: {
            authorization,
          },
        })

        if (shapes.ok) {
          const dataset = await shapes.dataset()
          dispatch.shape.setShape([...dataset])
          if (clearResource) {
            dispatch.resource.replaceGraph({
              dataset: [],
              newVersion: false,
            })
          }
        } else {
          alert(`Failed to load shapes: ${shapes.status}`)
        }
      },
      async generateInstances() {
        const state = store.getState()
        if (state.shape.dataset) {
          const { nanoid } = await import('nanoid')

          const dataset = $rdf.dataset([...state.shape.dataset])
          const graph = clownface({ dataset })
          graph
            .has(sh.class)
            .out(sh.class)
            .forEach((clas) => {
              const lastSeparator = Math.max(clas.value.lastIndexOf('#'), clas.value.lastIndexOf('/'))
              const clasName = clas.value.substr(lastSeparator + 1)
              const instanceId = nanoid(5)
              graph.namedNode(`${document.location.origin}/${clasName}/${instanceId}`)
                .addOut(rdf.type, clas)
                .addOut(rdfs.label, `${clasName} ${instanceId}`)
            })
          dispatch.shape.setShape([...dataset])
        }
      },
    }
  },
})
