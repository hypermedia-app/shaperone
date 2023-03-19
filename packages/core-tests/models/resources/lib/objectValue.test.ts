import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf, { AnyContext, AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { xsd, rdf, foaf, dash, sh } from '@tpluscode/rdf-ns-builders'
import { NodeKind, NodeKindEnum } from '@rdfine/shacl'
import { defaultValue } from '@hydrofoil/shaperone-core/models/resources/lib/objectValue.js'
import { propertyShape } from '@shaperone/testing/util.js'
import { Term } from 'rdf-js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { ex } from '@shaperone/testing'
import DatasetExt from 'rdf-ext/lib/Dataset'
import CoreMetadata from '@hydrofoil/shaperone-core/metadata.js'
import { blankNode } from '@shaperone/testing/nodeFactory.js'

describe('core/models/resources/lib/defaultValue', () => {
  let editorMeta: AnyPointer<AnyContext, DatasetExt>

  beforeEach(() => {
    editorMeta = cf({ dataset: $rdf.dataset() })
  })

  it('returns default value from property', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      defaultValue: $rdf.literal('foo', xsd.anySimpleType),
    })
    const focusNode = graph.blankNode()

    // when
    const pointer = defaultValue({ property, focusNode, editorMeta })

    // then
    expect(pointer?.term).to.deep.eq($rdf.literal('foo', xsd.anySimpleType))
  })

  it('returns null when there is no nodeKind', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
    })
    const focusNode = graph.blankNode()

    // when
    const pointer = defaultValue({ property, focusNode, editorMeta })

    // then
    expect(pointer).to.be.null
  })

  it('creates a blank node when there is no sh:nodeKind and sh:class is set', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      class: foaf.Person,
    })
    const focusNode = graph.blankNode()

    // when
    const pointer = defaultValue({ property, focusNode, editorMeta })

    // then
    expect(pointer?.term?.termType).to.eq('BlankNode')
    expect(pointer?.out(rdf.type).term).to.deep.eq(foaf.Person)
  })

  it('returns null when there is nodeKind is sh:IRIOrLiteral ad there is no sh1:iriPrefix', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRIOrLiteral,
    })
    const focusNode = graph.blankNode()

    // when
    const pointer = defaultValue({ property, focusNode, editorMeta })

    // then
    expect(pointer).to.be.null
  })

  it('creates a random IRI when sh:nodeKind sh:IRI', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
    })
    const focusNode = graph.blankNode()

    // when
    const first = defaultValue({ property, focusNode, editorMeta })
    const second = defaultValue({ property, focusNode, editorMeta })

    // then
    expect(first?.term).not.to.deep.eq(second)
  })

  it('uses base from sh1:iriPrefix when sh:nodeKind sh:IRI', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })
    const focusNode = graph.blankNode()

    // when
    const term = defaultValue({ property, focusNode, editorMeta })?.term

    // then
    expect(term?.termType).to.eq('NamedNode')
    expect(term?.value).to.match(/^http:\/\/example.com\/foo\/.+$/)
  })

  it('creates a URI node when node kind is sh:BlankNodeOrIRI and property has sh1:iriPrefix', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.BlankNodeOrIRI,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })
    const focusNode = graph.blankNode()

    // when
    const term = defaultValue({ property, focusNode, editorMeta })?.term

    // then
    expect(term?.termType).to.eq('NamedNode')
    expect(term?.value).to.match(/^http:\/\/example.com\/foo\/.+$/)
  })

  it('creates a URI node when node kind is sh:IRIOrLiteral and property has sh1:iriPrefix', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRIOrLiteral,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })
    const focusNode = graph.blankNode()

    // when
    const term = defaultValue({ property, focusNode, editorMeta })?.term

    // then
    expect(term?.termType).to.eq('NamedNode')
    expect(term?.value).to.match(/^http:\/\/example.com\/foo\/.+$/)
  })

  it('forces give nodeKind when passed aas argument', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRIOrLiteral,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })
    const focusNode = graph.blankNode()
    const overrides = blankNode().addOut(sh.nodeKind, sh.BlankNode)

    // when
    const term = defaultValue({ property, focusNode, overrides, editorMeta })?.term

    // then
    expect(term?.termType).to.eq('BlankNode')
  })

  const resourceNodeKinds: [NodeKind, Term['termType']][] = [
    [NodeKindEnum.BlankNode, 'BlankNode'],
    [NodeKindEnum.BlankNodeOrIRI, 'BlankNode'],
    [NodeKindEnum.BlankNodeOrLiteral, 'BlankNode'],
    [NodeKindEnum.IRI, 'NamedNode'],
  ]

  resourceNodeKinds.forEach(([nodeKind, termType]) => {
    it(`creates a node of type ${termType} when nodeKind is ${nodeKind.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
      })
      const focusNode = graph.blankNode()

      // when
      const pointer = defaultValue({ property, focusNode, editorMeta })

      // then
      expect(pointer?.term?.termType).to.eq(termType)
    })

    it(`adds sh:class as rdf:type to node kind ${nodeKind.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
        class: foaf.Agent,
        [sh1.iriPrefix.value]: 'http://example.com/foo/',
      })
      const focusNode = graph.blankNode()

      // when
      const pointer = defaultValue({ property, focusNode, editorMeta })

      // then
      expect(pointer?.out(rdf.type).term).to.deep.eq(foaf.Agent)
    })

    it(`does not add rdf:type when node kind is ${nodeKind.value} but editor is ${dash.InstancesSelectEditor.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
        class: foaf.Agent,
        [dash.editor.value]: dash.InstancesSelectEditor,
        [sh1.iriPrefix.value]: 'http://example.com/foo/',
      })
      const focusNode = graph.blankNode()

      // when
      const pointer = defaultValue({ property, focusNode, editorMeta })

      // then
      expect(pointer?.out(rdf.type).term).to.be.undefined
    })
  })

  it('does not create a node when editor is not annotated', () => {
    // given
    const editor = ex.Editor
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
    })
    const focusNode = graph.blankNode()

    // then
    expect(defaultValue({ property, focusNode, editor, editorMeta })).to.be.null
  })

  it('creates a node when editor is annotated', () => {
    // given
    const editor = ex.Editor
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
    })
    const focusNode = graph.blankNode()
    editorMeta
      .node(editor)
      .addOut(sh1.implicitDefaultValue, true)

    // then
    expect(defaultValue({ property, focusNode, editor, editorMeta })).not.to.be.null
  })

  it('by default, creates a node for dash:DetailsEditor', () => {
    // given
    const editor = dash.DetailsEditor
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
    })
    const focusNode = graph.blankNode()
    editorMeta.dataset.addAll(CoreMetadata)

    // then
    expect(defaultValue({ property, focusNode, editor, editorMeta })).not.to.be.null
  })
})
