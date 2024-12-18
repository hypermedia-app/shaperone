import type { InstanceConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import SparqlClient from 'sparql-http-client/ParsingClient.js'
import type { ComponentDecorator, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import type { ComponentConstructor } from '@hydrofoil/shaperone-core/models/components/index.js'
import type { GraphPointer } from 'clownface'
import type { PropertyValues } from 'lit'
import env from '@hydrofoil/shaperone-core/env.js'

const wikidata = new SparqlClient({
  endpointUrl: 'https://query.wikidata.org/sparql',
})

const labelQuery = `
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

construct {
  ?id rdfs:label ?l
} where {
  ?id rdfs:label ?l
}`

const WikidataFetchMixin: ComponentDecorator<InstancesSelectEditor> = {
  applicableTo(component: ComponentConstructor) {
    return component.editor.equals(env().ns.dash.InstancesSelectEditor)
  },

  decorate(base) {
    return class InstanceFetchingComponent extends base implements InstancesSelectEditor {
      private loading = false
      private loaded = env().clownface()

      updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties)

        if (_changedProperties.has('choices') && this.choices.length) {
          this.loadLabels(...this.choices)
        }
      }

      async loadLabels(...iris: GraphPointer[]) {
        if (this.loading) {
          // avoid multiple requests
          return
        }

        this.loading = true
        try {
          const toFetch = iris
            // skip non-wikidata resources
            .filter(resource => resource.value.startsWith('http://www.wikidata.org/entity/'))
            // skip resources for which we already have data
            .filter(resource => !this.loaded.node(resource)
              .out(env().ns.rdfs.label).terms.length)

          if (toFetch.length === 0) {
            return
          }

          const query = `${labelQuery}
          VALUES ?id {
            ${toFetch.map(resource => `<${resource.value}>`).join(' ')}
          }`

          const loaded = await wikidata.query.construct(query)
          for (const quad of loaded) {
            this.loaded.dataset.add(quad)
          }

          this.setChoices()
        } finally {
          this.loading = false
        }
      }

      setChoices() {
        const property = this.property.shape

        // used combined triples from the Shapes Graph and the fetched data
        const loadedGraph = env().clownface({
          dataset: env().dataset([...this.loaded.dataset, ...property.pointer.dataset]),
        })

        if (property.class) {
          this.choices = loadedGraph
            .has(env().ns.rdf.type, property.class.id)
            .toArray()
        } else {
          this.choices = []
        }
      }
    }
  },
}

export const configure: InstanceConfigCallback = ({ components }) => {
  // register the decorator in the component registry
  components.decorate(WikidataFetchMixin)
}
