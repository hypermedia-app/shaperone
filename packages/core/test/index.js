import * as ns from '@tpluscode/rdf-ns-builders'
import namespace from '@rdfjs/namespace'
import cf from 'clownface'
import mocha from 'mocha'
import chai from 'chai'
import $rdf from 'rdf-ext'
import sinon from 'sinon'
import {form} from '../index.js'

const { describe, it, beforeEach } = mocha
const { expect } = chai

const ex = namespace('http://example.com/')

describe('@hydrofoil/shaperone/form', () => {
    let dataset
    let renderer

    beforeEach(() => {
        dataset = $rdf.dataset()
        renderer = {
            getResult: sinon.stub()
        }
    })

    it('adds rdf:type assertion', async () => {
        // given
        const shape = {
            targetClass: {
                id: ns.schema.Person
            },
            property: []
        }
        const resource = cf({ dataset, term: ex.foo })

        // when
        await form({
            shape,
            resource,
            matcher: {},
            renderer,
        })

        // then
        chai.expect(dataset.toCanonical()).to.matchSnapshot()
    })

    it('wraps graph pointer as shape instance', async () => {
        // given
        const shape = cf({ dataset: $rdf.dataset() })
            .blankNode()
            .addOut(ns.rdf.type, ns.sh.Shape)
            .addOut(ns.sh.targetClass, ns.schema.Person)
        const resource = cf({ dataset, term: ex.foo })

        // when
        await form({
            shape,
            resource,
            matcher: {},
            renderer,
        })

        // then
        chai.expect(dataset.toCanonical()).to.matchSnapshot()
    })
})
