# clownface-shacl-path

Provides functions to work with [SHACL Property Paths](https://www.w3.org/TR/shacl/#property-paths)

## Install

```bash
yarn add clownface-shacl-path
```

## Usage

### `findNodes`

Find nodes in RDF/JS graphs by following [SHACL Property Paths](https://www.w3.org/TR/shacl/#property-paths) using [clownface](https://npm.im/clownface) graph traversal library.

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

#### Remarks

The package does not implement the `*OrMore` paths


### `toSparql`

Converts a [SHACL Property Path](https://www.w3.org/TR/shacl/#property-paths) to SPARQL Property Path string template object. Use the property path with [@tpluscode/sparql-builder](https://npm.im/@tpluscode/sparql-builder)

```typescript
import type {GraphPointer} from 'clownface'
import { toSparql } from 'clownface-shacl-path'
import { SELECT } from '@tpluscode/sparql-builder'

/*
 [ sh:path 
   [
     sh:alternativePath (
       ( schema:knows schema:name )
       ( foaf:knows foaf:name )
     )
   ]
 ]
 */
let path: GraphPointer

/*
  SELECT ?friendName
  WHERE {
    ?person a <http://schema.org/Person> .
    ?person (schema:knows|schema:name)|(foaf:knows|foaf:name) ?friendName
  }
 */
SELECT`?friendName`
  .WHERE`
    ?person a <http://schema.org/Person> .
    ?person ${toSparql(path)} ?friendName .
  `.build()
```
