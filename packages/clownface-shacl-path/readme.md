# clownface-shacl-path

Find nodes in RDF/JS graphs by following [SHACL Property Paths](https://www.w3.org/TR/shacl/#property-paths) using [clownface](https://npm.im/clownface) graph traversal library.

## Install

```bash
yarn add clownface-shacl-path
```

## Usage

The exported function takes two parameters:

1. starting graph pointer node
2. graph pointer to a SHACL Property Path

```js
import { findNodes } from 'clownface-shacl-path'
import fetch from '@rdfjs/fetch'
import $rdf from 'rdf-ext'
import clownface from 'clownface'
import { sh } from '@tpluscode/rdf-ns-builders'

// prepare a clownface Graph Pointer
const response = await fetch('http://zazuko.github.io/tbbt-ld/dist/tbbt.nt', { factory: $rdf })
const amy = clownface({ dataset: await response.dataset() })
    .namedNode('http://localhost:8080/data/person/amy-farrah-fowler')

// prepare a SHACL Property Path structure as clownface
const path = clownface({ dataset: $rdf.dataset() }).blankNode()

/*
  sh:path [
    sh:alternativePath ( # find both
      [ sh:inversePath schema:spouse ] # Sheldon, who is Amy's spouse
      [ sh:inversePath schema:knows ] # Leonard, who knows Amy
    )
  ]
*/
path.addList(sh.alternativePath, [
  path.blankNode().addOut(sh.inversePath, schema.spouse),
  path.blankNode().addOut(sh.inversePath, schema.knows)
])

// find nodes connected by the path
findNodes(amy, path)
```

## Implementation

The package does not implement the `*OrMore` paths
