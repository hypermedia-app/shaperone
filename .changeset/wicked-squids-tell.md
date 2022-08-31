---
"@hydrofoil/shaperone-core": patch
---

When adding a new value to a property which was `sh:nodeKind sh:IRI`, an empty IRI `<>` was always created, even if it clashed without existing nodes. Now random IRI references will be generated.
Also, if a property is annotated with `dash:uriStart`, it will be used as base for the created URIs
