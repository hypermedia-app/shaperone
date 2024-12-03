---
"@hydrofoil/shaperone-wc": minor
---

Big change how elements are configured. Global config can be set using the `configure.js` module. 

```js
import { configure } from '@hydrofoil/shaperone-wc'

await configure(({ components, editors, renderer, validation }) => {
  
})
```

Additionally, each component can be customised further by providing calling `configure` method of the component.

```html
<shaperone-form></shaperone-form>

<script type="module">
  import { configure } from '@hydrofoil/shaperone-wc'
  
  // global configuration must always be invoked 
  configure()

  document.querySelector('shaperone-form').configure(({ components, editors, renderer, validation }) => {
  })
</script>
```
