---
"@hydrofoil/shaperone-core": patch
---

Potentially breaking: removed `focusOnObjectNode` from multi editor actions since it was not actually passed to
the implementing code, nor did it make sense anyway.
