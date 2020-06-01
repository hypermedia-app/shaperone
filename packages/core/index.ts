import rdfine from '@tpluscode/rdfine'
import * as ns from '@tpluscode/rdf-ns-builders'
import type {SingleContextClownface} from 'clownface';
import type {BlankNode, NamedNode} from 'rdf-js';
import type {PropertyShape, Shape} from '@rdfine/shacl'

export interface Renderer<TResult> {
    getResult(): TResult
}

interface ShapeMatcher {}

interface ChangeCallback {
    (resource: SingleContextClownface<NamedNode | BlankNode>, property: PropertyShape, value: any): void
}

export interface ChangeListener {
    onChange(cb: ChangeCallback): void
    notify(resource: SingleContextClownface<NamedNode | BlankNode>, property: PropertyShape, value: any): void
}

interface FormParams<TRenderer extends Renderer<TResult>, TResult> {
    shape: SingleContextClownface<NamedNode | BlankNode> | Shape
    resource: SingleContextClownface<NamedNode | BlankNode>
    renderer: TRenderer
    matcher: ShapeMatcher
    validationReport?: any
    changeListener?: ChangeListener
}

export async function form<TRenderer extends Renderer<TResult>, TResult>(params: FormParams<TRenderer, TResult>) {
    const { resource } = params
    let shape: Shape

    if ('_context' in params.shape) {
        const { ShapeDependencies } = (await import('@rdfine/shacl/dependencies/Shape.js'))
        rdfine.factory.addMixin(...Object.values(ShapeDependencies))
        shape = rdfine.factory.createEntity(params.shape)
    } else {
        shape = params.shape
    }

    if (shape.targetClass) {
        resource.addOut(ns.rdf.type, shape.targetClass.id)
    }
}
