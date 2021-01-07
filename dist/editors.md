# Editors

The editors are composed of four distinct elements which come together when a SHACL Shape is rendered for a specific `FocusNode`.

1. Editor identifier
2. Editor matchers
3. Components
4. Editor metadata

There are also two kinds of editors:

* Single Editors (`dash:SingleEditor`)
* Multi Editors (`dash:MultiEditor`)

As the name implies, "single editors" are rendered as individual form elements for individual graph objects and update the graph one by one.

Conversely, a "multi editor" is rendered only one for an entire [Property Shape](https://www.w3.org/TR/shacl/#property-shapes) and must update all values at once.

All default editors are "single editors". A multi editor must be implemented separately as a reusable, or app-specific extension. An example of a multi editor could be a multi-select combo box.

[![example multi editor](../_media/multi-select.png)][example-multi-editor]

> [!EXAMPLE]
> Click the image to see this editor in action.

## Editor identifier

The identifier is simply a URI, represented throughout the code as an [RDF/JS NamedNode](https://rdf.js.org/data-model-spec/#namednode-interface).

The core shaperone package implements a set of DASH editors, whose identifiers are all from the namespace `http://datashapes.org/dash#`.

> [!TIP]
> In your code use `import { dash } from '@tpluscode/rdf-ns-builders'` to access the DASH vocabulary, including code completion of the term names.

The [DASH](editors/dash.md) page provides details about the default editors.

## Editor matchers

Shaperone selects the appropriate editors by applying simple matcher functions to the properties+objects.

First, any possible multi editors are matched against the property. Then single editors are matched against each individual object.

Both kinds of matchers return a numeric score value or `null` to indicate how applicable a given editor is for a property/object.

* `score = 0` means that an editor is not applicable
* The higher a `score > 0`, the higher the priority for it to be selected
* `null` indicates that an editor may or may not be applicable

> [!TIP]
> A renderer may offer the users an option to switch the editor for objects and/or properties, if multi editors were matched. This is the default behaviour of renderers provided by shaperone packages.

Read more on the [separate page](editors/matchers.md) to learn how to implement matchers for your components or replace the matchers for existing editors. 

## Components

Components are the visual User Interface presence of editors. A component maps the editor identifier to a function which renders the actual object to render in the form and receives callbacks to update the resource graph when the user interacts with them.

In the case of `@hydrofoil/shaperone-wc`, a components are rendered by `lit-html` templates.

Multiple components can be distributed as visually consistent sets, implementing a cohesive design systems. [Shaperone for Web Components](https://npm.im/@hydrofoil/shaperone-wc) comes with a number of such sets:

1. Browser native elements, which are available out of the box with the `shaperone-form` custom element
2. [Material Design](https://material.io/) elements implemented by [Material Web Components](https://github.com/material-components/material-components-web-components), available via [@hydrofoil/shaperone-wc-material](https://npm.im/@hydrofoil/shaperone-wc-material)
3. [Vaadin Components](https://vaadin.com/components/) provided by [@hydrofoil/shaperone-wc-vaadin](https://npm.im/@hydrofoil/shaperone-wc-vaadin)

> [!TIP]
> It is important to note however, that any combination of components is possible, mixing and matching implementations from different design systems and app-specific alike.

The [Configuration](configuration.md) page shows how components are set up so that they are available to the form.

More details about creating components to extend the default selection are available in the Components section

## Editor metadata

Editor metadata is an RDF/JS Dataset which contains descriptions of the input elements used on forms. Initially it contains the DASH vocabulary which provides English labels for the default editors. It can be extended with additional translations or information about custom editor types.

[example-multi-editor]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2FJohn_Doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22vcard%3Alanguage%22%3A+%5B%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2Fde%22%0A++++%7D%2C%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2Fpl%22%0A++++%7D%0A++%5D%0A%7D&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E+.%0A%40prefix+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%40prefix+lexvo%3A+%3Chttp%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2F%3E+.%0A%0Aex%3APersonShape%0A++a+sh%3AShape+%3B%0A++sh%3AtargetClass+schema%3APerson+%3B%0A++rdfs%3Alabel+%22Person%22+%3B%0A++sh%3Aproperty+ex%3ASpokenLanguagesProperty+%3B%0A.%0A%0Aex%3ASpokenLanguagesProperty%0A++sh%3Apath+vcard%3Alanguage+%3B%0A++sh%3Aname+%22Spoken+languages%22+%3B%0A++sh%3AnodeKind+sh%3AIRI+%3B%0A++sh%3Ain+%28%0A++++lexvo%3Aen+lexvo%3Ade+lexvo%3Afr+lexvo%3Apl+lexvo%3Aes%0A++%29+%3B%0A.%0A%0Alexvo%3Aen+rdfs%3Alabel+%22English%22+.%0Alexvo%3Ade+rdfs%3Alabel+%22German%22+.%0Alexvo%3Afr+rdfs%3Alabel+%22French%22+.%0Alexvo%3Apl+rdfs%3Alabel+%22Polish%22+.%0Alexvo%3Aes+rdfs%3Alabel+%22Spanish%22+.&components=vaadin
