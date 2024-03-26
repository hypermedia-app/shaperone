# Validation

The Shaperone core library does not perform validation on its own and instead requires an additional component which will process the Shapes Graph + Data Graph and return a graph pointer (RDF/JS term and dataset).

## Configuration

`@hydrofoil/shaperone-rdf-validate-shacl` provides the default validation choice, which can be configured using the usual way:

```typescript
import rdf from '@zazuko/env'
import { validate } from '@hydrofoil/shaperone-rdf-validate-shacl'

const { validation } = configure(rdf)

validation.setValidator(validate)
```

## Implement your own

Provide an async function as shown below

```typescript
import type { DatasetCore } from 'rdf-js'
import rdf from '@zazuko/env'
import { configure } from '@hydrofoil/shaperone-wc/configure'
import clownface, { GraphPointer } from 'clownface'
import createReport from './lib/my-validator'

const { validation } = configure(rdf)

async function validate(shapes: DatasetCore, data: DatasetCore): Promise<GraphPointer> {
    return createReport(shapes, data)
}

validation.setValidator(validate)
````

## Validating

Validation will be triggered automatically as data graph changes but can be triggered on demand by calling a function of the `<shaperone-form>` custom element. It also exposes getters to inspect the results.

```typescript
import { ShaperoneForm } from '@hydrofoil/shaperone-wc/ShaperoneForm' 

let element: ShaperoneForm

element.validate()

// true/false
element.isValid
// array of results
element.validationResults
// raw graph pointer
element.validationReport
``` 

## Rendering

At every rendering level, the state objects expose the validation results associated with that and deeper levels. 

For example, at property level, this will include all validation results of all its objects and the property itself. At focus node level, all properties and all their object will be combined.

> [!WARNING]
> Not every result can be associated with a precise focus node + property + object combination. Such may be the case when a validation result is somehow incomplete (lacks `sh:object`) or incorrect (e.g. `sh:focusNode` not found in data graph).

Implementors can handle that by rendering results at the deepest possible level, finding the ones to render by inspecting the [.matchedTo](/api/interfaces/_hydrofoil_shaperone_core_models_forms.validationresultstate.html#matchedto) property of individual results. Below snippet shows how one could render a summary of property errors, which are not associated with any specific object.

```typescript
import { html } from 'lit-html'
import { PropertyTemplate } from '@hydrofoil/shaperone-wc/templates'

export function property(decorated: PropertyTemplate) {
    const renderer: PropertyTemplate = (context, args) => {
        let summary = html``
        
        // Find and render list of errors not specific to any object 
        const errors = context.property.validationResults.filter(({ matchedTo }) => matchedTo !== 'object')
        if (errors.length) {
            summary = html`<ul class="error-summary">
                ${errors.map(({ result }) => html`<li>${result.resultMessage}</li>`)}
            </ul>`
        }
        
        return html`${summary} ${decorated(context, args)}`
    }
    
    renderer.loadDependencies = decorated.loadDependencies
    renderer.styles = decorated.styles
    
    return renderer
}
```

A similar pattern can be applied to [`FocusNodeTemplate`](/api/interfaces/_hydrofoil_shaperone_wc_templates.focusnodetemplate.html) and [`FormTemplate`](/api/interfaces/_hydrofoil_shaperone_wc_templates.formtemplate.html).
