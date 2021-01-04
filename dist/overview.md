# Shaperone

Form UI elements driven by [SHACL](https://www.w3.org/TR/shacl/) and [DASH](http://datashapes.org/forms.html).

Visit the [Playground](http://${playground}) for a running example presenting the different features of Shaperone.

## Installation

Out of the box Shaperone provides a Web Component implementation of the core functionality, which could thus be used in any modern application.

> [!TIP]
> The [core of Shaperone](core) is agnostic of the UI technology and thus any front end framework could be used to implement the form rendering. 

To install the form web component

```
yarn add @hydrofoil/shaperone-wc
```

### Form layout

The web component itself does not provide any decent-looking layout of the form elements. A simple yet customizable Material Design layout and component set (using [Material Web Components](https://github.com/material-components/material-components-web-components)) is available as a separate package.

```
yarn add @hydrofoil/shaperone-wc-material
```

Check the [Rendering Layout](layout) page for details about customizing the form appearance.

### Form elements

Independently of the layout implementation, all the form components can be replaced to provide a consistent look&feel for the forms across an application.

At the time of writing a package implementing [Vaadin Web Components](https://vaadin.com/components) is distributed alongside Material Design elements. 

```
yarn add @hydrofoil/shaperone-wc-vaadin
``` 

Check the [Editors](editors) page for more information on customizing the selection and appearance of editor elements as well as creating your own editors for nonstandard properties.

## Adding the form to a page

TBD
