# Shaperone anatomy

The core library is agnostic and theoretically could be basis for various implementations: custom elements, Vue, React, etc. That said, it is not a goal itself to ensure that it would be equally easy in any case. Right now Shaperone is implemented as a web component `shaperone-form` using lit-html.

On this foundation it is possible to implement form components using a specific design system and extending the core functionality of managing the form's state and behaviour.

![shaperone stack](/_media/stack.png)

When positioned on a page, all forms share the editor matchers, components and metadata, while allowing separate styling and of course each form hold its own [Shapes Graph][sg] and [Data Graph][dg].

![shaperone stack](/_media/configuration.png)

Finally, individual form combines the information extracted from the [Shapes Graph][sg] with the resources' [Data Graph][dg] to build the interactive form using approriate editor components.

1. The correct Shape is selected base on annotated [targets](https://www.w3.org/TR/shacl/#targets)
2. Every Property Shape gets a section to render its objects (including [ordering](https://www.w3.org/TR/shacl/#order) and [grouping](https://www.w3.org/TR/shacl/#group))...
4. ...with multiple objects are rendered together
5. Property Shape annotations are used to adjust the property and object rendering:
   - cardinalities
   - editor selection and configuration using `dash` vocabulary
   - any custom annotation supported by the specialized implementations
   
![shaperone stack](/_media/anatomy.png)

[sg]: https://www.w3.org/TR/shacl/#shapes-graph
[dg]: https://www.w3.org/TR/shacl/#data-graph
