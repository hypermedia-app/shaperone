import * as ns from '@tpluscode/rdf-ns-builders'
import namespace from '@rdfjs/namespace'
import cf from 'clownface'
import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { initialState } from '../index.js'
import DatasetExt from 'rdf-ext/lib/Dataset'

const ex = namespace('http://example.com/')

describe('@hydrofoil/shaperone', () => {
  let dataset: DatasetExt
  let renderer: any

  beforeEach(() => {
    dataset = $rdf.dataset()
  })

  it('adds rdf:type assertion', async () => {
    // given
    const shape = {
      targetClass: {
        id: ns.schema.Person,
      },
      property: [],
    }
    const focusNode = cf({ dataset, term: ex.foo })

    // when
    await initialState({
      shape,
      focusNode,
      matcher: {},
      renderer,
    })

    // then
    expect(dataset.toCanonical()).to.matchSnapshot()
  })

  it('wraps graph pointer as shape instance', async () => {
    // given
    const shape = cf({ dataset: $rdf.dataset() })
      .blankNode()
      .addOut(ns.rdf.type, ns.sh.Shape)
      .addOut(ns.sh.targetClass, ns.schema.Person)
    const focusNode = cf({ dataset, term: ex.foo })

    // when
    await initialize({
      shape,
      focusNode,
      matcher: {},
      renderer,
    })

    // then
    expect(dataset.toCanonical()).to.matchSnapshot()
  })
})
