---
"@hydrofoil/shaperone-core": minor
---

Changes to `@hydrofoil/shaperone-wc/configure`:
- It is now required to call `env.use($rdf)`
- `editors.addMetadata` now takes a function `(env: ShaperoneEnvironment) => DatasetCore | Iterable<Quad>`
