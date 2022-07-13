---
"@hydrofoil/shaperone-hydra": patch
---

Instance selector with templated `hydra:search` should construct search URIs from multiple related focus nodes when selected `sh:path`

For example, given a focus node like

```turtle
prefix ex: <http://example.org/>

[
    ex:child [ ex:name "John" ] ;
    ex:child [ ex:name "Jane" ] ;
] .
```

And property shape

```turtle
prefix ex: <http://example.org/>
prefix sh: <http://www.w3.org/ns/shacl#>
prefix hydra: <http://www.w3.org/ns/hydra/core#>

[
  hydra:search
    [
      sh:path ex:child ;
      hydra:template "{?name}" ;
      hydra:mapping
        [
          hydra:variable "name" ;
          hydra:property ex:name ;
        ] ;
    ] ;
] .
```

A constructed URL would combine both names from both child nodes to expand into `?name=John,Jane`
