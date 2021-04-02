# @hydrofoil/shaperone-rdf-validate-shacl

SHACL validation support for @hydrofoil/shaperone. Using [rdf-validate-shacl](https://npm.im/rdf-validate-shacl)

## Configuration

See [documentation](https://forms.hypermedia.app/#/validation?id=configuration)

## Options

The exported function has an optional parameter which allows configuring the underlying validation library.

```typescript
import $rdf from 'rdf-ext'
import { validate } from '@hydrofoil/shaperone-rdf-validate-shacl'

validate.with({
  factory: $rdf,
  maxErrors: 10,
})
```
