import { SparqlTemplateResult, sparql } from '@tpluscode/rdf-string'
import { MultiPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'

interface PartialPath {
  path: SparqlTemplateResult
  sequence?: boolean
  length: number
}

function sequence(left: PartialPath, operator: string, index: number) {
  const leftWrapped = left.length > 1 && left.sequence !== true ? sparql`(${left.path})` : left.path

  return (right: PartialPath): PartialPath => {
    if (index === 0) {
      return right
    }

    const rightWrapped = right.length > 1 && right.sequence !== true ? sparql`(${right.path})` : right.path

    return {
      path: sparql`${leftWrapped}${operator}${rightWrapped}`,
      length: 2,
      sequence: left.sequence && right.sequence,
    }
  }
}

function traverse(propertyPath: PartialPath, path: MultiPointer, index = 0): PartialPath {
  if (!path.term) {
    throw new Error('SHACL Path must be single node')
  }

  const list = path.list()
  if (list) {
    const segments = [...list]
    if (segments.length === 1) {
      throw new Error('SHACL Property Path list must have at least 2 elements')
    }

    return segments.reduce(traverse, propertyPath)
  }

  const next = sequence(propertyPath, '/', index)

  if (path.term.termType === 'BlankNode') {
    if (path.out(sh.inversePath).term) {
      const inverse = traverse(propertyPath, path.out(sh.inversePath))
      if (inverse.length > 1) {
        return next({
          path: sparql`^(${inverse.path})`,
          length: 1,
        })
      }

      return next({
        path: sparql`^${inverse.path}`,
        length: 1,
      })
    }

    if (path.out(sh.alternativePath).term) {
      const list = path.out(sh.alternativePath).list()
      if (!list) {
        throw new Error('Object of sh:alternativePath must be an RDF List')
      }

      const [first, ...rest] = [...list].map((alt) => {
        const altElement = traverse(propertyPath, alt)
        if (altElement.length > 1) {
          return {
            path: sparql`(${altElement.path})`,
            length: 1,
          }
        }

        return altElement
      })

      if (rest.length) {
        return next({
          path: sparql`${rest.reduce((alt, next) => sparql`${alt}|${next.path}`, first.path)}`,
          length: rest.length + 1,
        })
      }

      throw new Error('sh:alternativePath must have at least two elements')
    }

    if (path.out(sh.zeroOrMorePath).term) {
      const inner = traverse(propertyPath, path.out(sh.zeroOrMorePath))
      if (inner.length > 1) {
        return next({
          path: sparql`(${inner.path})*`,
          length: 1,
        })
      }

      return next({
        path: sparql`${inner.path}*`,
        length: 1,
      })
    }

    if (path.out(sh.oneOrMorePath).term) {
      const inner = traverse(propertyPath, path.out(sh.oneOrMorePath))
      if (inner.length > 1) {
        return next({
          path: sparql`(${inner.path})+`,
          length: 1,
        })
      }

      return next({
        path: sparql`${inner.path}+`,
        length: 1,
      })
    }

    if (path.out(sh.zeroOrOnePath).term) {
      const inner = traverse(propertyPath, path.out(sh.zeroOrOnePath))
      if (inner.length > 1) {
        return next({
          path: sparql`(${inner.path})?`,
          length: 1,
        })
      }

      return next({
        path: sparql`${inner.path}?`,
        length: 1,
      })
    }

    throw new Error(`Unrecognized property path ${path.value}`)
  }

  return next({
    path: sparql`${path.term}`,
    length: 1,
    sequence: true,
  })
}

/**
 * Creates a SPARQL template string which represents a SHACL path as Property Path
 *
 * @param path SHACL Property Path
 */
export function toSparql(path: MultiPointer | NamedNode): SparqlTemplateResult {
  if ('termType' in path) {
    return sparql`${path}`
  }

  return traverse({
    path: sparql``,
    length: 0,
  }, path).path
}
