import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { rdf, schema, rdfs } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { matchShapes } from '@hydrofoil/shaperone-core/models/shapes/lib/index.js'
import { nodeShape } from '@shaperone/testing/util.js'

describe('models/shapes/lib', () => {
  describe('matchShapes', () => {
    const focusNode = $rdf.clownface()
      .namedNode('john')
      .addOut(rdf.type, schema.Person)
      .addOut(schema.alumniOf, $rdf.namedNode('UCLA'))
      .addIn(schema.parent, $rdf.namedNode('jane'))

    const johnShape = nodeShape({ targetNode: [$rdf.namedNode('john')] })
    const personClassShape = nodeShape({ targetClass: [schema.Person] })
    const alumnusShape = nodeShape({ targetSubjectsOf: schema.alumniOf })
    const parentShape = nodeShape({ targetObjectsOf: schema.parent })
    const implicitPersonTargetShape = nodeShape(schema.Person, { types: [rdfs.Class] })

    it('prefers sh:targetNode over all other shape targets', () => {
      // given
      const shapes = [
        personClassShape,
        alumnusShape,
        johnShape,
        parentShape,
      ]

      // when
      const matched = matchShapes(shapes).to(focusNode)

      // then
      expect(matched).to.have.length(4)
      expect(matched[0].id).to.deep.eq(johnShape.id)
    })

    it('prefers sh:targetClass over property target shapes', () => {
      // given
      const shapes = [
        alumnusShape,
        personClassShape,
        parentShape,
      ]

      // when
      const matched = matchShapes(shapes).to(focusNode)

      // then
      expect(matched).to.have.length(3)
      expect(matched[0].id).to.deep.eq(personClassShape.id)
    })

    it('prefers implicit rdf:Class shape over property shapes', () => {
      // given
      const shapes = [
        alumnusShape,
        implicitPersonTargetShape,
        parentShape,
      ]

      // when
      const matched = matchShapes(shapes).to(focusNode)

      // then
      expect(matched).to.have.length(3)
      expect(matched[0].id).to.deep.eq(implicitPersonTargetShape.id)
    })

    it('matches shape by subject usage in graph', () => {
      // given
      const shapes = [
        alumnusShape,
      ]

      // when
      const matched = matchShapes(shapes).to(focusNode)

      // then
      expect(matched[0].id).to.deep.eq(alumnusShape.id)
    })

    it('matches shape by object usage in graph', () => {
      // given
      const shapes = [
        parentShape,
      ]

      // when
      const matched = matchShapes(shapes).to(focusNode)

      // then
      expect(matched[0].id).to.deep.eq(parentShape.id)
    })
  })
})
