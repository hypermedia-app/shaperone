import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import cf, { SingleContextClownface } from 'clownface'
import { schema } from '@tpluscode/rdf-ns-builders'
import { Shape } from '@rdfine/shacl'
import { DatasetCore } from 'rdf-js'
import type { Store } from '../store'
import { Menu, updateMenu } from '../../menu'
import { serialize } from '../../serializer'

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
  pointer?: SingleContextClownface
  format: string
  serialized: string
  context: Record<string, any>
  menu: Menu
}

export const resource = createModel({
  state: <State>{
    serialized: JSON.stringify(jsonld, null, 2),
    format: 'application/ld+json',
    context: {},
    menu: {
      text: 'Format',
      children: [{
        type: 'format',
        text: 'application/ld+json',
        checked: true,
      }, {
        type: 'format',
        text: 'text/turtle',
      }],
    },
  },
  reducers: {
    updatePointer(state, { pointer }: { pointer: SingleContextClownface }) {
      return {
        ...state,
        pointer,
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
        menu: updateMenu(state.menu, 'format', format),
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

        dispatch.resource.updatePointer({
          pointer: cf({ dataset, term: $rdf.namedNode('http://example.com/John_Doe') }),
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
