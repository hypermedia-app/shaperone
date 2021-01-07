# Editor matchers

Matcher is at its core a function which returns a number or `null` score. The score is used to determine whether a given editor can be used for a particular RDF value. 

## Implementing a matcher

A matcher is defined as a plain JavaScript object, with properties for the editor URI and the actual match function. 

For example, the Star Rating component could be implemented to return a positive score for `schema:ratingValue` predicates, as defined by shapes `sh:path`.

```typescript
import { SingleEditor } from '@hydrofoil/shaperone-core'
import { namedNode } from '@rdf-esm/data-model'

// create an URI for custom editors in your namespace
const editor = namedNode('http://example.com/StarRating')

export const matcher: SingleEditor = {
  term: editor,
  match(shape) {
    return shape.getPathProperty()?.id.equals(schema.ratingValue) ? 50 : 0
  },
}
```

Once an editor is created it needs to be added to shaperone. It is done globally so that it will be available to all forms in the application.

```typescript
import { editors } from '@hydrofoil/shaperone-wc/configure'
import * as StarRating from './components/StarRating'

editors.addMatchers({
  starRating: StarRating.matcher,
})
```

## Extending existing matchers

It is also possible to modify the scoring for editors by decorating other matchers, such as the built-in [DASH editors](editors/dash.md).

> [!WARNING]
> Currently, only `dash:SingleEditor` can be extended with decorators. 

In the example below the score for `dash:TextAreaEditor` is increased if the property is one of a set of URIs. `rdfs:comment`, `dcterms:description` or `schema:description`

```typescript
import { NamedNode } from 'rdf-js'
import { dcterms, schema, rdfs } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdf-esm/term-set'
import type { MatcherDecorator } from '@hydrofoil/shaperone-core/models/editors' 

// URIs of default properties which prefer multiline text
const multilineProperties = [
  dcterms.description,
  schema.description,
  rdfs.comment,
]

// export a factory so that the properties can be customised
export const preferTextArea = (properties = multilineProperties): MatcherDecorator => {
  const set = new TermSet(properties) 

  return {
    // decorate a specific editor
    term: dash.TextFieldEditor,
    // by wrapping another matcher
    decorate({ match }) {
      return function (shape, value) {
        const score = match(shape, value)
        
        if (score && set.has(shape.getPropertyPath())) {
            return score + 10
        }
        
        return score
      }
    },
  }
}
```

To use the decorator in an application, pass it to the shaperone configuration object.

```typescript
import { editors } from '@hydrofoil/shaperone-wc/configure'
import { preferTextArea } from './matcher-decorators'

editors.decorate(preferTextArea())
```

> [!TIP]
> Multiple matcher decorators of the same editor can be used, and they will be called in the order exact order in which they were added.
