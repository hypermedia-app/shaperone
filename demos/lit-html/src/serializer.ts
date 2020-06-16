import { DatasetCore } from 'rdf-js'
import { turtle } from '@tpluscode/rdf-string'
import { serializers } from '@rdf-esm/formats-common'
import $rdf from 'rdf-ext'
import toString from 'stream-to-string'

export async function jsonLdSerializer() {
  const JsonLdSerializer = (await import('@rdfjs/serializer-jsonld-ext')).default

  return new JsonLdSerializer({ encoding: 'string' })
}

export async function serialize(dataset: DatasetCore, format: string, options: any): Promise<string> {
  if (format === 'text/turtle') {
    return turtle`${dataset}`.toString()
  }

  const stream = serializers.import(format, $rdf.dataset([...dataset]).toStream(), options)
  if (!stream) {
    throw new Error('Failed to serialize resource')
  }

  const serialized = await toString(stream as any)
  return JSON.stringify(JSON.parse(serialized), null, 2)
}

serializers.set('application/ld+json', jsonLdSerializer)
