---
"@hydrofoil/shaperone-core": patch
---

When a property has `sh:class` and no `sh:nodeKind`, a blank node should be created for new form values
This behaviour was inadvertently broken in #236
